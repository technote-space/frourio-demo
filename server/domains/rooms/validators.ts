import { IsNotEmpty, Length, IsInt, IsPositive, Min } from 'class-validator';

export class RoomBody {
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  number: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  price: number;
}
