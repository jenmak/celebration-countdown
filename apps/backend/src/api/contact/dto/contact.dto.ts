import { RelationshipEnum } from '@celebrationcountdown/shared'
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator'

export class CreateContactDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  fullName: string

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'birthdate must be YYYY-MM-DD' })
  birthdate: string

  @IsEnum(RelationshipEnum)
  relationship: RelationshipEnum

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string | null
}

export class UpdateContactDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  fullName?: string

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'birthdate must be YYYY-MM-DD' })
  birthdate?: string

  @IsOptional()
  @IsEnum(RelationshipEnum)
  relationship?: RelationshipEnum

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string | null
}
