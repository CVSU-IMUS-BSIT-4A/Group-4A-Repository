import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ChatroomService } from './chatroom.service';
import { Chatroom } from './chatroom.entity';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';

@ApiTags('chatrooms')
@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get()
  @ApiOperation({ summary: 'Get all chatrooms' })
  @ApiResponse({ status: 200, description: 'List of all chatrooms', type: [Chatroom] })
  async findAll(): Promise<Chatroom[]> {
    return await this.chatroomService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chatroom by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Chatroom ID' })
  @ApiResponse({ status: 200, description: 'Chatroom found', type: Chatroom })
  @ApiResponse({ status: 404, description: 'Chatroom not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Chatroom | null> {
    return await this.chatroomService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new chatroom' })
  @ApiResponse({ status: 201, description: 'Chatroom created', type: Chatroom })
  async create(@Body() createChatroomDto: CreateChatroomDto): Promise<Chatroom> {
    return await this.chatroomService.create(
      createChatroomDto.name,
      createChatroomDto.description,
      createChatroomDto.icon,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a chatroom' })
  @ApiParam({ name: 'id', type: 'number', description: 'Chatroom ID' })
  @ApiResponse({ status: 200, description: 'Chatroom updated', type: Chatroom })
  @ApiResponse({ status: 404, description: 'Chatroom not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChatroomDto: UpdateChatroomDto,
  ): Promise<Chatroom | null> {
    return await this.chatroomService.update(
      id,
      updateChatroomDto.name,
      updateChatroomDto.description,
      updateChatroomDto.icon,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chatroom' })
  @ApiParam({ name: 'id', type: 'number', description: 'Chatroom ID' })
  @ApiResponse({ status: 200, description: 'Chatroom deleted successfully' })
  @ApiResponse({ status: 404, description: 'Chatroom not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean }> {
    const success = await this.chatroomService.remove(id);
    return { success };
  }
}
