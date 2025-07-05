import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateReportDto{
    @ApiProperty({ example: 'This post contains inappropriate content' })
    @IsString()
    @IsNotEmpty()
    reason: string;

    @IsString()
    @IsOptional()
    details?: string;
}