import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
    const note = this.notesRepository.create({
      ...createNoteDto,
      user: { id: userId } as User
    });
    return this.notesRepository.save(note);
  }

  async findAll(userId: number): Promise<Note[]> {
    return this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('note.updatedAt', 'DESC')
      .getMany();
  }

  async findOne(id: number, userId: number): Promise<Note> {
    const note = await this.notesRepository.findOne({ 
      where: { id, user: { id: userId } },
      relations: ['user']
    });
    
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number): Promise<Note> {
    const note = await this.findOne(id, userId);
    
    if (note.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to update this note');
    }
    
    const updated = this.notesRepository.merge(note, updateNoteDto);
    return this.notesRepository.save(updated);
  }

  async remove(id: number, userId: number): Promise<void> {
    const note = await this.findOne(id, userId);
    
    if (note.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this note');
    }
    
    const result = await this.notesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  }
}
