import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, min, MinLength } from 'class-validator';

enum supportLevelEnum {
  Level_One,
  Level_Two,
  Level_Three,
}

enum pronounsEnum {
  He_Him,
  She_Her,
  They_Them,
  Other,
  Prefer_Not_To_Say,
}
export class UpdateUserDTO {
  @ApiProperty({ example: 'João Silva Araújo' })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Senha234' })
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: supportLevelEnum })
  supportLevel?: 'Level_One' | 'Level_Two' | 'Level_Three';

  @ApiProperty({ example: pronounsEnum })
  pronouns?: 'He_Him' | 'She_Her' | 'They_Them' | 'Other' | 'Prefer_Not_To_Say';
  @ApiProperty({ example: 'Tenho x anos, gosto de jogar e assistir séries.' })
  bio?: string;
}
