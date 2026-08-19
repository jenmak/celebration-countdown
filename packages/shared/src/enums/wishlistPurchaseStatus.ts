export enum WishlistPurchaseStatus {
  SAVED = 'SAVED',
  IN_CART = 'IN_CART',
  PURCHASED = 'PURCHASED',
}

export const WISHLIST_PURCHASE_STATUS_VALUES = Object.values(
  WishlistPurchaseStatus,
)

export function isPurchasedStatus(status: string): boolean {
  return status === WishlistPurchaseStatus.PURCHASED
}
