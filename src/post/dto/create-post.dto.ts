import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto{
    @ApiProperty({example: 'My First Post'})
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({example: 'This is the content of my first post'})
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({example: ['tag1', 'tag2']})
    @IsArray()
    @IsOptional()
    @ArrayMinSize(1)
    tags?: string[];
}