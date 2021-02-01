import { IsNotEmpty, Length, IsInt, IsPositive, Min } from 'class-validator';

export class RoomBody {
  @IsNotEmpty({ message: '値を入力してください' })
  @Length(1, 100, { message: '1~100文字で入力してください' })
  name: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsInt({ message: '整数値を指定してください' })
  @IsPositive({ message: '1以上を指定してください' })
  number: number;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsInt({ message: '整数値を指定してください' })
  @Min(0, { message: '0以上を指定してください' })
  price: number;
}
