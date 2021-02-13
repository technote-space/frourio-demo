import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';
import { IsIdExists } from '$/repositories/utils/validator';

export class RoomKeyBody {
  @IsNotEmpty({ message: '値を入力してください' })
  @IsInt({ message: '整数値を指定してください' })
  @IsPositive({ message: '1以上を指定してください' })
  @IsIdExists('room')
  roomId: number;

  @IsNotEmpty({ message: '値を入力してください' })
  key: string;
}

export class RoomQrBody {
  @IsNotEmpty({ message: '値を入力してください' })
  @IsInt({ message: '整数値を指定してください' })
  @IsPositive({ message: '1以上を指定してください' })
  @IsIdExists('room')
  roomId: number;

  @IsNotEmpty({ message: '値を入力してください' })
  data: string;
}
