import type Blob from 'cross-blob';
import type { Role } from '$/repositories/role';
import { IsNotEmpty, Length, IsEmail, MinLength, IsOptional } from 'class-validator';
import { IsUniqueValue, IsOptionalWhenUpdate } from '$/repositories/utils/validator';

export class AdminBody {
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUniqueValue('admin')
  email: string;

  @IsOptional()
  @MinLength(4)
  @IsOptionalWhenUpdate()
  password?: string;

  @IsOptional()
  icon?: Blob | string;

  @IsOptional()
  roles?: Role[];
}
