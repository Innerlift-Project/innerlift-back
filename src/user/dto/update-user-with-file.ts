import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

enum supportLevelEnum {
  Level_One = 'Level_One',
  Level_Two = 'Level_Two',
  Level_Three = 'Level_Three',
}

enum pronounsEnum {
  He_Him = 'He_Him',
  She_Her = 'She_Her',
  They_Them = 'They_Them',
  Other = 'Other',
  Prefer_Not_To_Say = 'Prefer_Not_To_Say',
}

export class UpdateUserWithFileDTO {
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
  supportLevel?: supportLevelEnum;

  @ApiProperty({ enum: pronounsEnum })
  pronouns?: pronounsEnum;

  @ApiProperty({ example: 'Tenho x anos, gosto de jogar e assistir séries.' })
  bio?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Foto de perfil (imagem)',
  })
  profilePicture?: any;
}
