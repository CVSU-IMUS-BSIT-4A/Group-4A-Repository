import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';

@ApiTags('comments')
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Param('postId', ParseIntPipe) postId: number, @Body() body: { content: string; authorId?: number }) {
    return this.commentsService.create({ ...body, post: { id: postId } as any });
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Param('postId', ParseIntPipe) postId: number, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.commentsService.findAllByPost(postId, Number(page), Number(limit));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}


