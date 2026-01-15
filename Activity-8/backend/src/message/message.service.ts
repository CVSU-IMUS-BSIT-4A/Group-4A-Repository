import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(chatroomId: number, username: string, message: string): Promise<Message> {
    const newMessage = this.messageRepository.create({
      chatroomId,
      username,
      message,
    });
    return await this.messageRepository.save(newMessage);
  }

  async findByChatroom(chatroomId: number): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { chatroomId },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Message | null> {
    return await this.messageRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find({
      order: { id: 'ASC' },
    });
  }

  async update(id: number, message?: string): Promise<Message | null> {
    const msg = await this.findOne(id);
    if (!msg) return null;

    if (message !== undefined) msg.message = message;

    return await this.messageRepository.save(msg);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.messageRepository.delete(id);
    return result.affected !== undefined && result.affected !== null && result.affected > 0;
  }
}
