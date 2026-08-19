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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { AuthenticationGuard } from '@nestjs-cognito/auth'
import { LocalUserGuard } from '../auth/guards/cognito-auth.guard'
import { ContactService } from './contact.service'
import { CreateContactDTO, UpdateContactDTO } from './dto/contact.dto'

@Controller('contact')
@UseGuards(AuthenticationGuard, LocalUserGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.contactService.list(user.id)
  }

  @Get(':id')
  getById(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.contactService.getById(user.id, id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: AuthUser, @Body() body: CreateContactDTO) {
    return this.contactService.create(user.id, body)
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateContactDTO,
  ) {
    return this.contactService.update(user.id, id, body)
  }

  @Post(':id/photo')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadPhoto(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.contactService.uploadPhoto(user.id, id, file)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.contactService.remove(user.id, id)
  }

  @Post(':id/gift-facets')
  @HttpCode(HttpStatus.OK)
  generateGiftFacets(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.contactService.generateGiftFacets(user.id, id)
  }
}
