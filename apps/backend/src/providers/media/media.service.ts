import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { AWSConfigService } from '@config/aws/config.service'
import { S3ConfigService } from '@config/storage/config.service'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

@Injectable()
export class MediaService {
  private readonly s3Client: S3Client

  constructor(
    @Inject(AWSConfigService)
    private readonly awsConfig: AWSConfigService,
    @Inject(S3ConfigService)
    private readonly s3Config: S3ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.awsConfig.region,
      credentials: {
        accessKeyId: this.awsConfig.accessKey,
        secretAccessKey: this.awsConfig.secret,
      },
    })
  }

  async uploadContactPhoto(
    userId: string,
    contactId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Photo file is required')
    }
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        'Photo must be a JPEG, PNG, WebP, or GIF image',
      )
    }

    const extension = this.extensionForMime(file.mimetype)
    const key = `contacts/${userId}/${contactId}/${Date.now()}-${randomUUID()}.${extension}`

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.s3Config.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    )

    return `https://${this.s3Config.bucket}.s3.${this.awsConfig.region}.amazonaws.com/${key}`
  }

  private extensionForMime(mime: string): string {
    switch (mime) {
      case 'image/png':
        return 'png'
      case 'image/webp':
        return 'webp'
      case 'image/gif':
        return 'gif'
      default:
        return 'jpg'
    }
  }
}
