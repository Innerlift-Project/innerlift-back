import { IsEmail, IsNotEmpty, min, MinLength } from "class-validator";

export class CreateUserDTO{
    @IsNotEmpty()
    fullName: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    
}