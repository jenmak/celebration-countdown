import { createHash } from 'node:crypto'
import {
  AmazonGiftFacetsResponse,
  AmazonGiftFacetsResult,
  withAmazonSearchUrls,
} from '@celebrationcountdown/shared'
import { Prisma } from '@celebrationcountdown/orm/dist/generated/client'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { AnthropicService } from '@providers/anthropic/anthropic.service'
import { MediaService } from '@providers/media/media.service'
import { PrismaService } from '@providers/prisma/prisma.service'
import { CreateContactDTO, UpdateContactDTO } from './dto/contact.dto'
import { serializeContact } from './serializers/contact.serializer'

function hashNotes(notes: string | null | undefined): string {
  return createHash('sha256')
    .update(notes?.trim() ?? '')
    .digest('hex')
}

@Injectable()
export class ContactService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    private readonly anthropicService: AnthropicService,
    private readonly mediaService: MediaService,
  ) {}

  async list(userId: string) {
    const contacts = await this.prisma.contact.findMany({
      where: { userId },
      orderBy: { fullName: 'asc' },
    })
    return contacts.map(serializeContact)
  }

  async getById(userId: string, id: string) {
    const contact = await this.findOwned(userId, id)
    return serializeContact(contact)
  }

  async create(userId: string, body: CreateContactDTO) {
    const contact = await this.prisma.contact.create({
      data: {
        userId,
        fullName: body.fullName.trim(),
        birthdate: new Date(`${body.birthdate}T00:00:00.000Z`),
        relationship: body.relationship,
        notes: body.notes?.trim() ? body.notes.trim() : null,
      },
    })
    return serializeContact(contact)
  }

  async update(userId: string, id: string, body: UpdateContactDTO) {
    const existing = await this.findOwned(userId, id)
    const nextNotes =
      body.notes === undefined
        ? existing.notes
        : body.notes?.trim()
          ? body.notes.trim()
          : null
    const notesChanged = (existing.notes ?? null) !== nextNotes

    const contact = await this.prisma.contact.update({
      where: { id },
      data: {
        ...(body.fullName !== undefined
          ? { fullName: body.fullName.trim() }
          : {}),
        ...(body.birthdate !== undefined
          ? { birthdate: new Date(`${body.birthdate}T00:00:00.000Z`) }
          : {}),
        ...(body.relationship !== undefined
          ? { relationship: body.relationship }
          : {}),
        ...(body.notes !== undefined ? { notes: nextNotes } : {}),
        ...(notesChanged
          ? {
              amazonGiftFacets: Prisma.DbNull,
              amazonFacetsNotesHash: null,
              amazonFacetsGeneratedAt: null,
            }
          : {}),
      },
    })

    return serializeContact(contact)
  }

  async uploadPhoto(
    userId: string,
    id: string,
    file: Express.Multer.File,
  ) {
    await this.findOwned(userId, id)
    const photoUrl = await this.mediaService.uploadContactPhoto(
      userId,
      id,
      file,
    )
    const contact = await this.prisma.contact.update({
      where: { id },
      data: { photoUrl },
    })
    return serializeContact(contact)
  }

  async remove(userId: string, id: string) {
    await this.findOwned(userId, id)
    await this.prisma.contact.delete({ where: { id } })
    return { success: true }
  }

  async generateGiftFacets(
    userId: string,
    id: string,
  ): Promise<AmazonGiftFacetsResponse> {
    const contact = await this.findOwned(userId, id)
    const notesHash = hashNotes(contact.notes)
    const cached = contact.amazonGiftFacets as AmazonGiftFacetsResult | null

    if (
      cached?.facets?.length &&
      contact.amazonFacetsNotesHash === notesHash
    ) {
      return {
        facets: withAmazonSearchUrls(cached),
        generatedAt: cached.generatedAt,
        cached: true,
      }
    }

    const result = await this.anthropicService.generateGiftFacets({
      notes: contact.notes,
      fullName: contact.fullName,
      relationship: contact.relationship,
    })

    await this.prisma.contact.update({
      where: { id: contact.id },
      data: {
        amazonGiftFacets: result as unknown as Prisma.InputJsonValue,
        amazonFacetsNotesHash: notesHash,
        amazonFacetsGeneratedAt: new Date(result.generatedAt),
      },
    })

    return {
      facets: withAmazonSearchUrls(result),
      generatedAt: result.generatedAt,
      cached: false,
    }
  }

  private async findOwned(userId: string, id: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id, userId },
    })
    if (!contact) {
      throw new NotFoundException(`Contact ${id} not found`)
    }
    return contact
  }
}
