import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import {
  AmazonGiftFacet,
  AmazonGiftFacetsResult,
  FALLBACK_AMAZON_FACET,
} from '@celebrationcountdown/shared'
import Anthropic from '@anthropic-ai/sdk'
import { AnthropicConfigService } from '@config/anthropic/config.service'

export type GenerateGiftFacetsInput = {
  notes: string | null | undefined
  fullName: string
  relationship: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseFacets(payload: unknown): AmazonGiftFacet[] {
  if (!isRecord(payload) || !Array.isArray(payload.facets)) {
    return []
  }

  return payload.facets
    .filter(isRecord)
    .map((item): AmazonGiftFacet | null => {
      const label = typeof item.label === 'string' ? item.label.trim() : ''
      const keywords =
        typeof item.keywords === 'string' ? item.keywords.trim() : ''
      if (!label || !keywords) {
        return null
      }

      const filters = isRecord(item.filters) ? item.filters : undefined
      return {
        label,
        keywords,
        filters: filters
          ? {
              brand:
                typeof filters.brand === 'string' ? filters.brand : undefined,
              category:
                typeof filters.category === 'string'
                  ? filters.category
                  : undefined,
              maxPriceUsd:
                typeof filters.maxPriceUsd === 'number'
                  ? filters.maxPriceUsd
                  : undefined,
            }
          : undefined,
        reasoning:
          typeof item.reasoning === 'string' ? item.reasoning : undefined,
      }
    })
    .filter((facet): facet is AmazonGiftFacet => facet !== null)
    .slice(0, 6)
}

@Injectable()
export class AnthropicService {
  private client: Anthropic | null = null

  constructor(private readonly anthropicConfig: AnthropicConfigService) {}

  private getClient(): Anthropic {
    if (!this.anthropicConfig.apiKey) {
      throw new ServiceUnavailableException(
        'ANTHROPIC_API_KEY is not configured',
      )
    }
    if (!this.client) {
      this.client = new Anthropic({ apiKey: this.anthropicConfig.apiKey })
    }
    return this.client
  }

  async generateGiftFacets(
    input: GenerateGiftFacetsInput,
  ): Promise<AmazonGiftFacetsResult> {
    const notes = input.notes?.trim()
    if (!notes) {
      return {
        facets: [FALLBACK_AMAZON_FACET],
        generatedAt: new Date().toISOString(),
      }
    }

    const client = this.getClient()
    let message
    try {
      message = await client.messages.create({
        model: this.anthropicConfig.model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You recommend Amazon gift search facets from notes about a person.
Return JSON only with shape: {"facets":[{"label":string,"keywords":string,"filters":{"brand"?:string,"category"?:string,"maxPriceUsd"?:number},"reasoning"?:string}]}
Rules:
- Return 3 to 6 facets.
- "label" is short chip text for the UI.
- "keywords" is an Amazon search query (no URL).
- Prefer concrete gift ideas grounded in the notes.
- Do not invent medical conditions or sensitive attributes not in the notes.

Person:
${JSON.stringify({
  fullName: input.fullName,
  relationship: input.relationship,
  notes,
})}`,
          },
        ],
      })
    } catch (error) {
      const detail =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: string }).message)
          : 'Anthropic request failed'
      throw new ServiceUnavailableException(detail)
    }

    const textBlock = message.content.find((block) => block.type === 'text')
    const raw = textBlock && textBlock.type === 'text' ? textBlock.text : null
    if (!raw) {
      throw new ServiceUnavailableException('Anthropic returned an empty response')
    }

    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new ServiceUnavailableException('Anthropic returned invalid JSON')
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      throw new ServiceUnavailableException('Anthropic returned invalid JSON')
    }

    const facets = parseFacets(parsed)
    if (facets.length === 0) {
      throw new ServiceUnavailableException(
        'Anthropic returned facets in an unexpected shape',
      )
    }

    return {
      facets,
      generatedAt: new Date().toISOString(),
    }
  }
}
