import {
  WishlistPurchaseStatus,
  isPurchasedStatus,
} from '@celebrationcountdown/shared'
import { GiftWishlistItem } from '@celebrationcountdown/orm/dist/generated/client'

export type WishlistItemResponse = {
  id: string
  contactId: string
  productName: string
  brand: string | null
  price: number | null
  amazonUrl: string
  imageUrl: string | null
  purchaseStatus: WishlistPurchaseStatus
  isPurchased: boolean
  createdAt: string
  updatedAt: string
}

function normalizePurchaseStatus(
  status: string | null | undefined,
  isPurchased: boolean,
): WishlistPurchaseStatus {
  if (
    status === WishlistPurchaseStatus.SAVED ||
    status === WishlistPurchaseStatus.IN_CART ||
    status === WishlistPurchaseStatus.PURCHASED
  ) {
    return status
  }
  return isPurchased
    ? WishlistPurchaseStatus.PURCHASED
    : WishlistPurchaseStatus.SAVED
}

export function serializeWishlistItem(
  item: GiftWishlistItem,
): WishlistItemResponse {
  const purchaseStatus = normalizePurchaseStatus(
    item.purchaseStatus,
    item.isPurchased,
  )
  return {
    id: item.id,
    contactId: item.contactId,
    productName: item.productName,
    brand: item.brand,
    price: item.price === null || item.price === undefined ? null : Number(item.price),
    amazonUrl: item.amazonUrl,
    imageUrl: item.imageUrl,
    purchaseStatus,
    isPurchased: isPurchasedStatus(purchaseStatus),
    createdAt: item.createdAt.toISOString(),
    updatedAt: (item.updatedAt ?? item.createdAt).toISOString(),
  }
}
