import { User } from "generated/prisma";



export class UserDto {
    fullName: string | null;
    email: string;
    supportLevel?: 'Level_One' | 'Level_Two' | 'Level_Three' | null;
    pronouns?: 'He_Him' | 'She_Her' | 'They_Them' | 'Other' | 'Prefer_Not_To_Say' | null;
    createdAt: Date;
    bio?: string | null;

    constructor(user: User){
        this.fullName = user.fullName;
        this.email = user.email;
        this.supportLevel = user.supportLevel;
        this.pronouns = user.pronouns;
        this.createdAt = user.createdAt;
        this.bio = user.bio;
    }
}