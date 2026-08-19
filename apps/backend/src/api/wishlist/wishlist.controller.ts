import { AuthUser, CurrentUser } from '@common/decorators/current-user.decorator'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthenticationGuard } from '@nestjs-cognito/auth'
import { LocalUserGuard } from '../auth/guards/cognito-auth.guard'
import {
  CreateWishlistItemDTO,
  SetWishlistPurchaseStatusDTO,
  UpdateWishlistItemDTO,
} from './dto/wishlist.dto'
import { WishlistService } from './wishlist.service'

@Controller('contact/:contactId/wishlist')
@UseGuards(AuthenticationGuard, LocalUserGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    return this.wishlistService.list(user.id, contactId)
  }

  @Get(':itemId')
  getById(
    @CurrentUser() user: AuthUser,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.wishlistService.getById(user.id, contactId, itemId)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: AuthUser,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() body: CreateWishlistItemDTO,
  ) {
    return this.wishlistService.create(user.id, contactId, body)
  }

  @Patch(':itemId')
  update(
    @CurrentUser() user: AuthUser,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() body: UpdateWishlistItemDTO,
  ) {
    return this.wishlistService.update(user.id, contactId, itemId, body)
  }

  @Post(':itemId/status')
  @HttpCode(HttpStatus.OK)
  setStatus(
    @CurrentUser() user: AuthUser,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() body: SetWishlistPurchaseStatusDTO,
  ) {
    return this.wishlistService.setPurchaseStatus(
      user.id,
      contactId,
      itemId,
      body.purchaseStatus,
    )
  }

  @Post(':itemId/purchase')
  @HttpCode(HttpStatus.OK)
  markPurchased(
    @CurrentUser() user: AuthUser,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.wishlistService.setPurchased(
      user.id,
      contactId,
      itemId,
      true,
    )
  }

  @Post(':itemId/unpurchase')
  @HttpCode(HttpStatus.OK)
  markUnpurchased(
    @CurrentUser() user: AuthUser,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.wishlistService.setPurchased(
      user.id,
      contactId,
      itemId,
      false,
    )
  }

  @Delete(':itemId')
  @HttpCode(HttpStatus.OK)
  remove(
    @CurrentUser() user: AuthUser,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.wishlistService.remove(user.id, contactId, itemId)
  }
}
