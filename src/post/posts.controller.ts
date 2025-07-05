// posts.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assumindo que você tem um guard JWT
import { Request } from 'express';

interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // CRUD Posts
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: AuthRequest) {
    console.log('User ID:', req.user.id);
    return this.postsService.create(createPostDto, req.user.id);
  }

  @Get()
  findAll(@Query() queryDto: QueryPostsDto) {
    return this.postsService.findAll(queryDto);
  }

  @Get('popular')
  findPopular(@Query('limit') limit?: number) {
    return this.postsService.findPopular(limit);
  }

  @Get('by-tags')
  findByTags(@Query('tags') tags: string[]) {
    // Garantir que tags seja um array
    const tagsArray = Array.isArray(tags) ? tags : [tags];
    return this.postsService.findByTags(tagsArray);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: AuthRequest,
  ) {
    return this.postsService.update(id, updatePostDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.postsService.remove(id, req.user.id);
  }

  // Comentários
  @Post(':id/comments')
  createComment(
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthRequest,
  ) {
    return this.postsService.createComment(postId, createCommentDto, req.user.id);
  }

  @Delete('comments/:commentId')
  deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: AuthRequest,
  ) {
    return this.postsService.deleteComment(commentId, req.user.id);
  }

  // Reações
  @Post(':id/reactions')
  createReaction(
    @Param('id') postId: string,
    @Body() createReactionDto: CreateReactionDto,
    @Req() req: AuthRequest,
  ) {
    return this.postsService.createReaction(postId, createReactionDto, req.user.id);
  }

  @Delete(':id/reactions')
  deleteReaction(@Param('id') postId: string, @Req() req: AuthRequest) {
    return this.postsService.deleteReaction(postId, req.user.id);
  }

  // Denúncias
  @Post(':id/reports')
  createReport(
    @Param('id') postId: string,
    @Body() createReportDto: CreateReportDto,
    @Req() req: AuthRequest,
  ) {
    return this.postsService.createReport(postId, createReportDto, req.user.id);
  }
}