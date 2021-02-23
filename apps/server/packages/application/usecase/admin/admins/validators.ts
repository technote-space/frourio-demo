import type Blob from 'cross-blob';
import type { Role } from '$/packages/domain/database/role';
import { IsNotEmpty, Length, IsEmail, MinLength, IsOptional } from 'class-validator';
import { IsUniqueValue, IsOptionalWhenUpdate } from '$/packages/domain/database/service/validator';
import { AdminRepository } from '$/packages/infra/database/admin';

export class AdminBody {
  @IsNotEmpty({ message: '値を入力してください' })
  @Length(1, 100, { message: '1~100文字で入力してください' })
  name: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsEmail(undefined, { message: '正しいメールアドレスを入力してください' })
  @IsUniqueValue(new AdminRepository())
  email: string;

  @IsOptional()
  @MinLength(4, { message: 'パスワードが短すぎます' })
  @IsOptionalWhenUpdate()
  password?: string;

  @IsOptional()
  icon?: Blob | string;

  @IsOptional()
  roles?: Role[];
}
