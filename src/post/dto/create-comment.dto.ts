import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto{
    @ApiProperty({ example: 'This is a comment on the post' })
    @IsString()
    @IsNotEmpty()
    content: string;
}