import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('notes')
@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  private getUserIdFromRequest(req: Request): number {
    // The user ID is set by the JWT strategy during authentication
    return (req.user as any)?.sub;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'The note has been successfully created.', type: Note })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createNoteDto: CreateNoteDto, @Req() req: Request): Promise<Note> {
    const userId = this.getUserIdFromRequest(req);
    return this.notesService.create(createNoteDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes for the current user' })
  @ApiResponse({ status: 200, description: 'Return all notes for the current user.', type: [Note] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req: Request): Promise<Note[]> {
    const userId = this.getUserIdFromRequest(req);
    return this.notesService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Return the note.', type: Note })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request
  ): Promise<Note> {
    const userId = this.getUserIdFromRequest(req);
    return this.notesService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'The note has been successfully updated.', type: Note })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req: Request
  ): Promise<Note> {
    const userId = this.getUserIdFromRequest(req);
    return this.notesService.update(id, updateNoteDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiResponse({ status: 204, description: 'The note has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request
  ): Promise<void> {
    const userId = this.getUserIdFromRequest(req);
    return this.notesService.remove(id, userId);
  }
}
