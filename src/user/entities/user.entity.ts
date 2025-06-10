export class User {
    id: String;
    fullName: string;
    email: string;
    password: string;
    supportLevel: 'Level_One' | 'Level_Two' | 'Level_Three';
    pronouns: 'He_Him' | 'She_Her' | 'They_Them' | 'Other' | 'Prefer_Not_To_Say';
    createdAt: Date;
    bio: string;
    profilePicture: string;
}