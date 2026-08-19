import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator'
import {
  WISHLIST_PURCHASE_STATUS_VALUES,
  WishlistPurchaseStatus,
} from '@celebrationcountdown/shared'

export class CreateWishlistItemDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  productName: string

  @IsString()
  @IsUrl({ require_protocol: true })
  @MaxLength(2000)
  amazonUrl: string

  @IsOptional()
  @IsString()
  @MaxLength(120)
  brand?: string | null

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number | null

  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true })
  @MaxLength(2000)
  imageUrl?: string | null
}

export class UpdateWishlistItemDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  productName?: string

  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true })
  @MaxLength(2000)
  amazonUrl?: string

  @IsOptional()
  @IsString()
  @MaxLength(120)
  brand?: string | null

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number | null

  @IsOptional()
  @IsString()
  @IsUrl({ require_protocol: true })
  @MaxLength(2000)
  imageUrl?: string | null

  @IsOptional()
  @IsBoolean()
  isPurchased?: boolean

  @IsOptional()
  @IsString()
  @IsIn(WISHLIST_PURCHASE_STATUS_VALUES)
  purchaseStatus?: WishlistPurchaseStatus
}

export class SetWishlistPurchaseStatusDTO {
  @IsString()
  @IsIn(WISHLIST_PURCHASE_STATUS_VALUES)
  purchaseStatus: WishlistPurchaseStatus
}
