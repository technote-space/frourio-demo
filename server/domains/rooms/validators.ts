import { Length, IsInt, IsPositive, Min } from 'class-validator';

export class RoomBody {
  @Length(1, 100)
  name: string;

  @IsInt()
  @IsPositive()
  number: number;

  @IsInt()
  @Min(0)
  price: number;
}
