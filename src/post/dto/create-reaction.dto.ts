import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export enum ReactionTypeEnum {
    HEART = "HEART",
    LIKE = "LIKE",
    DISLIKE = "DISLIKE",
}

export class CreateReactionDto {
    @ApiProperty({
        example: ReactionTypeEnum.HEART,})
    @IsEnum(ReactionTypeEnum)
    @IsOptional()
    type?: ReactionTypeEnum = ReactionTypeEnum.HEART;
}