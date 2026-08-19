export type AmazonGiftFacetFilters = {
  brand?: string
  category?: string
  maxPriceUsd?: number
}

export type AmazonGiftFacet = {
  label: string
  keywords: string
  filters?: AmazonGiftFacetFilters
  reasoning?: string
}

export type AmazonGiftFacetsResult = {
  facets: AmazonGiftFacet[]
  generatedAt: string
}

export type AmazonGiftFacetWithUrl = AmazonGiftFacet & {
  searchUrl: string
}

export type AmazonGiftFacetsResponse = {
  facets: AmazonGiftFacetWithUrl[]
  generatedAt: string
  cached: boolean
}

export function buildAmazonSearchKeywords(facet: AmazonGiftFacet): string {
  const parts = [facet.keywords.trim()]

  if (facet.filters?.brand?.trim()) {
    parts.push(facet.filters.brand.trim())
  }
  if (facet.filters?.category?.trim()) {
    parts.push(facet.filters.category.trim())
  }
  if (
    typeof facet.filters?.maxPriceUsd === 'number' &&
    Number.isFinite(facet.filters.maxPriceUsd)
  ) {
    parts.push(`under $${Math.round(facet.filters.maxPriceUsd)}`)
  }

  return parts.filter(Boolean).join(' ')
}

export function buildAmazonSearchUrl(
  facet: AmazonGiftFacet,
  associateTag?: string,
): string {
  const keywords = buildAmazonSearchKeywords(facet) || 'birthday gifts'
  const url = new URL('https://www.amazon.com/s')
  url.searchParams.set('k', keywords)
  if (associateTag?.trim()) {
    url.searchParams.set('tag', associateTag.trim())
  }
  return url.toString()
}

export function withAmazonAffiliateTag(
  amazonUrl: string,
  associateTag?: string,
): string {
  if (!associateTag?.trim()) {
    return amazonUrl
  }
  try {
    const url = new URL(amazonUrl)
    url.searchParams.set('tag', associateTag.trim())
    return url.toString()
  } catch {
    return amazonUrl
  }
}

/** Extract an ASIN from common Amazon product URL shapes. */
export function extractAmazonAsin(amazonUrl: string): string | null {
  try {
    const url = new URL(amazonUrl)
    const fromPath =
      url.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/i) ??
      url.pathname.match(/\/([A-Z0-9]{10})(?:[/?]|$)/i)
    if (fromPath?.[1]) return fromPath[1].toUpperCase()
    const asinParam = url.searchParams.get('asin')
    return asinParam?.match(/^[A-Z0-9]{10}$/i)
      ? asinParam.toUpperCase()
      : null
  } catch {
    return null
  }
}

/**
 * Build a mobile-friendly Amazon product URL.
 * Uses https universal links so iOS/Android can open the Amazon Shopping app
 * when installed (Associates Mobile Application Policy forbids WebViews).
 */
export function buildAmazonProductUrl(
  amazonUrl: string,
  associateTag?: string,
): string {
  const asin = extractAmazonAsin(amazonUrl)
  if (asin) {
    const url = new URL(`https://www.amazon.com/dp/${asin}`)
    if (associateTag?.trim()) {
      url.searchParams.set('tag', associateTag.trim())
    }
    return url.toString()
  }
  return withAmazonAffiliateTag(amazonUrl, associateTag)
}

export const FALLBACK_AMAZON_FACET: AmazonGiftFacet = {
  label: 'Birthday gifts',
  keywords: 'birthday gifts',
}

export function withAmazonSearchUrls(
  result: AmazonGiftFacetsResult,
  associateTag?: string,
): AmazonGiftFacetWithUrl[] {
  return result.facets.map((facet) => ({
    ...facet,
    searchUrl: buildAmazonSearchUrl(facet, associateTag),
  }))
}
