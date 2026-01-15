import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chatroom } from './chatroom.entity';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectRepository(Chatroom)
    private chatroomRepository: Repository<Chatroom>,
  ) {}

  async findAll(): Promise<Chatroom[]> {
    return await this.chatroomRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Chatroom | null> {
    return await this.chatroomRepository.findOne({ where: { id } });
  }

  async create(
    name: string,
    description?: string,
    icon?: string,
  ): Promise<Chatroom> {
    const chatroom = this.chatroomRepository.create({
      name,
      description: description ?? null,
      icon: icon ?? '💬',
    });
    return await this.chatroomRepository.save(chatroom);
  }

  async update(id: number, name?: string, description?: string, icon?: string): Promise<Chatroom | null> {
    const chatroom = await this.findOne(id);
    if (!chatroom) return null;

    if (name !== undefined) chatroom.name = name;
    if (description !== undefined) chatroom.description = description ?? null;
    if (icon !== undefined) chatroom.icon = icon;

    return await this.chatroomRepository.save(chatroom);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.chatroomRepository.delete(id);
    return result.affected !== undefined && result.affected !== null && result.affected > 0;
  }
}
