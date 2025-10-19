import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: { title: string; content: string }, @Request() req: any) {
    return this.postsService.create({ ...body, author: { id: req.user.userId } as any });
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.postsService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<{ title: string; content: string }>, @Request() req: any) {
    const post = await this.postsService.findOne(id);
    if (post.author?.id !== req.user.userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }
    return this.postsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const post = await this.postsService.findOne(id);
    if (post.author?.id !== req.user.userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    return this.postsService.remove(id);
  }
}


