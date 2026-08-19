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
  UPCOMING_BIRTHDAY_LIMIT,
  birthdayCountdown,
  compareByUpcomingBirthday,
  daysInMonth,
  formatPlainDate,
  isValidPlainDate,
  parsePlainDate,
  sortByUpcomingBirthday,
  toPlainDate,
} from './birthdays/countdown'
export type { BirthdayCountdown, PlainDate } from './birthdays/countdown'

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
