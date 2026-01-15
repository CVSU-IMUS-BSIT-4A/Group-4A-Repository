import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@ApiTags('messages')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @ApiOperation({ summary: 'Get all messages or filter by chatroom' })
  @ApiQuery({ name: 'chatroomId', required: false, type: 'number', description: 'Filter messages by chatroom ID' })
  @ApiResponse({ status: 200, description: 'List of messages', type: [Message] })
  async findAll(@Query('chatroomId') chatroomId?: string): Promise<Message[]> {
    if (chatroomId) {
      return await this.messageService.findByChatroom(parseInt(chatroomId, 10));
    }
    return await this.messageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a message by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Message ID' })
  @ApiResponse({ status: 200, description: 'Message found', type: Message })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Message | null> {
    return await this.messageService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message created', type: Message })
  async create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return await this.messageService.create(
      createMessageDto.chatroomId,
      createMessageDto.username,
      createMessageDto.message,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a message' })
  @ApiParam({ name: 'id', type: 'number', description: 'Message ID' })
  @ApiResponse({ status: 200, description: 'Message updated', type: Message })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ): Promise<Message | null> {
    return await this.messageService.update(id, updateMessageDto.message);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message' })
  @ApiParam({ name: 'id', type: 'number', description: 'Message ID' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean }> {
    const success = await this.messageService.remove(id);
    return { success };
  }
}
