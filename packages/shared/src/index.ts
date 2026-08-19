export const APP_NAME = 'Celebration Countdown'

export {
  RELATIONSHIP_VALUES,
  RelationshipEnum,
} from './enums/relationshipEnum'

export {
  WISHLIST_PURCHASE_STATUS_VALUES,
  WishlistPurchaseStatus,
  isPurchasedStatus,
} from './enums/wishlistPurchaseStatus'

export {
  FALLBACK_AMAZON_FACET,
  buildAmazonProductUrl,
  buildAmazonSearchKeywords,
  buildAmazonSearchUrl,
  extractAmazonAsin,
  withAmazonAffiliateTag,
  withAmazonSearchUrls,
} from './amazon/giftFacets'
export type {
  AmazonGiftFacet,
  AmazonGiftFacetFilters,
  AmazonGiftFacetWithUrl,
  AmazonGiftFacetsResponse,
  AmazonGiftFacetsResult,
} from './amazon/giftFacets'
