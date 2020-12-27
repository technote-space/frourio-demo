import { Length, Matches, IsNotEmpty } from 'class-validator';

export class GuestBody {
  @Length(1, 100)
  name: string;

  @Length(1, 100)
  @Matches(/^[ァ-ヴー・　\s]+$/, { // eslint-disable-line no-irregular-whitespace
    message: 'This value is not kana',
  })
  nameKana: string;

  @Matches(/^[0-9]{3}-[0-9]{4}$|^[0-9]{3}-[0-9]{2}$|^[0-9]{3}$|^[0-9]{5}$|^[0-9]{7}$/, {
    message: 'This value is not zip code',
  })
  zipCode: string;

  @IsNotEmpty()
  address: string;

  @Matches(/^[0-9]{2,4}-?[0-9]{2,4}-?[0-9]{3,4}$/, {
    message: 'This value is not phone number',
  })
  phone: string;
}
