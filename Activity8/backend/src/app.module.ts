import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatroomModule } from './chatroom/chatroom.module';
import { MessageModule } from './message/message.module';
import { ChatGateway } from './chat/chat.gateway';
import { Chatroom } from './chatroom/chatroom.entity';
import { Message } from './message/message.entity';

@Module({
  imports: [
    ChatroomModule,
    MessageModule, // MessageModule exports MessageService
    // Configure TypeORM (MySQL)
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'activity8',
      entities: [Chatroom, Message],
      synchronize: true,      // auto-create tables
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
