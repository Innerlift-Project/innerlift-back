import { IsOptional, IsString, IsArray, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';


export class QueryPostsDto{
    @ApiProperty({example: 'Search term',})
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({example: ['tag1', 'tag2'],})
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiProperty({example: 'authorId',})
    @IsOptional()
    @IsString()
    authorId?: string;

    @ApiProperty({example: 1,})
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({example: 10,})
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}