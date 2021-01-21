import type Blob from 'cross-blob';
import { IsNotEmpty, Length, IsEmail, MinLength, IsOptional } from 'class-validator';

export class AdminBody {
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @IsOptional()
  icon?: Blob;

  @IsOptional()
  roles?: string[];
}
