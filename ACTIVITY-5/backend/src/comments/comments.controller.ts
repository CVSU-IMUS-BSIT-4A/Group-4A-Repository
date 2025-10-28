import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, Request, ForbiddenException, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';

@ApiTags('comments')
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Param('postId', ParseIntPipe) postId: number, @Body() body: { content: string }, @Request() req: any) {
    return this.commentsService.create({ 
      ...body, 
      post: { id: postId } as any,
      author: { id: req.user.userId } as any
    });
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Param('postId', ParseIntPipe) postId: number, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.commentsService.findAllByPost(postId, Number(page), Number(limit));
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: { content: string }, @Request() req: any) {
    const comment = await this.commentsService.findOne(id);
    if (comment.author?.id !== req.user.userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }
    return this.commentsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const comment = await this.commentsService.findOne(id);
    if (comment.author?.id !== req.user.userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    return this.commentsService.remove(id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async likeComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Request() req: any
  ) {
    return this.commentsService.likeComment(commentId, req.user.userId);
  }

  @Post(':id/dislike')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async dislikeComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Request() req: any
  ) {
    return this.commentsService.dislikeComment(commentId, req.user.userId);
  }

  @Get(':id/reaction')
  @UseGuards(AuthGuard('jwt'))
  async getUserReaction(
    @Param('id', ParseIntPipe) commentId: number,
    @Request() req: any
  ) {
    const reaction = await this.commentsService.getUserReaction(commentId, req.user.userId);
    return { reaction };
  }
}


