import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, min, MinLength } from "class-validator";

export class CreateUserDTO{
    @ApiProperty({example: 'João'})
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({example: 'João'})
    @IsEmail()
    email: string;

    @ApiProperty({example: 'João'})
    @MinLength(6)
    password: string;

    
}