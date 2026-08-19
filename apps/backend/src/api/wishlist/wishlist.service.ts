import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
  WishlistPurchaseStatus,
  isPurchasedStatus,
} from '@celebrationcountdown/shared'
import { PrismaService } from '@providers/prisma/prisma.service'
import {
  CreateWishlistItemDTO,
  UpdateWishlistItemDTO,
} from './dto/wishlist.dto'
import { serializeWishlistItem } from './serializers/wishlist.serializer'

@Injectable()
export class WishlistService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async list(userId: string, contactId: string) {
    await this.ensureContactOwned(userId, contactId)
    const items = await this.prisma.giftWishlistItem.findMany({
      where: { contactId },
      orderBy: [{ isPurchased: 'asc' }, { createdAt: 'desc' }],
    })
    return items.map(serializeWishlistItem)
  }

  async getById(userId: string, contactId: string, itemId: string) {
    const item = await this.findOwnedItem(userId, contactId, itemId)
    return serializeWishlistItem(item)
  }

  async create(
    userId: string,
    contactId: string,
    body: CreateWishlistItemDTO,
  ) {
    await this.ensureContactOwned(userId, contactId)
    const item = await this.prisma.giftWishlistItem.create({
      data: {
        contactId,
        addedByUserId: userId,
        productName: body.productName.trim(),
        amazonUrl: body.amazonUrl.trim(),
        brand: body.brand?.trim() ? body.brand.trim() : null,
        price: body.price ?? null,
        imageUrl: body.imageUrl?.trim() ? body.imageUrl.trim() : null,
        purchaseStatus: WishlistPurchaseStatus.SAVED,
        isPurchased: false,
      },
    })
    return serializeWishlistItem(item)
  }

  async update(
    userId: string,
    contactId: string,
    itemId: string,
    body: UpdateWishlistItemDTO,
  ) {
    await this.findOwnedItem(userId, contactId, itemId)

    let purchaseStatus = body.purchaseStatus
    if (purchaseStatus === undefined && body.isPurchased !== undefined) {
      purchaseStatus = body.isPurchased
        ? WishlistPurchaseStatus.PURCHASED
        : WishlistPurchaseStatus.SAVED
    }

    const item = await this.prisma.giftWishlistItem.update({
      where: { id: itemId },
      data: {
        ...(body.productName !== undefined
          ? { productName: body.productName.trim() }
          : {}),
        ...(body.amazonUrl !== undefined
          ? { amazonUrl: body.amazonUrl.trim() }
          : {}),
        ...(body.brand !== undefined
          ? { brand: body.brand?.trim() ? body.brand.trim() : null }
          : {}),
        ...(body.price !== undefined ? { price: body.price } : {}),
        ...(body.imageUrl !== undefined
          ? { imageUrl: body.imageUrl?.trim() ? body.imageUrl.trim() : null }
          : {}),
        ...(purchaseStatus !== undefined
          ? {
              purchaseStatus,
              isPurchased: isPurchasedStatus(purchaseStatus),
            }
          : {}),
      },
    })
    return serializeWishlistItem(item)
  }

  async setPurchaseStatus(
    userId: string,
    contactId: string,
    itemId: string,
    purchaseStatus: WishlistPurchaseStatus,
  ) {
    return this.update(userId, contactId, itemId, { purchaseStatus })
  }

  async setPurchased(
    userId: string,
    contactId: string,
    itemId: string,
    isPurchased: boolean,
  ) {
    return this.setPurchaseStatus(
      userId,
      contactId,
      itemId,
      isPurchased
        ? WishlistPurchaseStatus.PURCHASED
        : WishlistPurchaseStatus.SAVED,
    )
  }

  async remove(userId: string, contactId: string, itemId: string) {
    await this.findOwnedItem(userId, contactId, itemId)
    await this.prisma.giftWishlistItem.delete({ where: { id: itemId } })
    return { success: true }
  }

  private async ensureContactOwned(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, userId },
    })
    if (!contact) {
      throw new NotFoundException(`Contact ${contactId} not found`)
    }
    return contact
  }

  private async findOwnedItem(
    userId: string,
    contactId: string,
    itemId: string,
  ) {
    await this.ensureContactOwned(userId, contactId)
    const item = await this.prisma.giftWishlistItem.findFirst({
      where: { id: itemId, contactId },
    })
    if (!item) {
      throw new NotFoundException(`Wishlist item ${itemId} not found`)
    }
    return item
  }
}
