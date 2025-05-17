import { IsEmail, IsNotEmpty, min, MinLength } from "class-validator";

export class UpdateUserDTO{
    @IsNotEmpty()
    fullName: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    supportLevel?: 'Level_One' | 'Level_Two' | 'Level_Three';
    pronouns?: 'He_Him' | 'She_Her' | 'They_Them' | 'Other' | 'Prefer_Not_To_Say';
    bio?: string;
    
}