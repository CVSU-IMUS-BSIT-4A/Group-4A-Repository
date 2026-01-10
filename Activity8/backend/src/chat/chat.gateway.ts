import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../message/message.service';
import { ChatroomService } from '../chatroom/chatroom.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, string>(); // socket.id → username
  private roomUsers = new Map<number, Set<string>>(); // roomId → Set of socket.id
  private userRooms = new Map<string, number>(); // socket.id → roomId

  constructor(
    private messageService: MessageService,
    private chatroomService: ChatroomService,
  ) {}

  async onModuleInit() {
    // Initialize default rooms if they don't exist
    const existingRooms = await this.chatroomService.findAll();
    if (existingRooms.length === 0) {
      await this.chatroomService.create('General', 'General discussion room', '💬');
      await this.chatroomService.create('Random', 'Random topics and fun chat', '🎲');
      console.log('Default rooms created');
    }
  }

  // Find the lowest available person number
  private getNextAvailablePersonNumber(): number {
    const usedNumbers = new Set<number>();
    
    // Extract all person numbers currently in use
    this.clients.forEach((username) => {
      const match = username.match(/^Person(\d+)$/);
      if (match) {
        usedNumbers.add(parseInt(match[1], 10));
      }
    });

    // Find the lowest available number starting from 1
    let number = 1;
    while (usedNumbers.has(number)) {
      number++;
    }
    
    return number;
  }

  async handleConnection(client: Socket) {
    const personNumber = this.getNextAvailablePersonNumber();
    const username = `Person${personNumber}`;
    this.clients.set(client.id, username);
    console.log(`${username} connected`);
    client.emit('assignUsername', username); // Sabihin sa client ang username
    
    // Send current rooms list with user counts
    await this.sendRoomsList(client);
  }

  handleDisconnect(client: Socket) {
    const username = this.clients.get(client.id);
    const roomId = this.userRooms.get(client.id);
    
    // Remove user from room
    if (roomId !== undefined) {
      const users = this.roomUsers.get(roomId);
      if (users) {
        users.delete(client.id);
        if (users.size === 0) {
          this.roomUsers.delete(roomId);
        } else {
          // Broadcast updated user count
          this.server.emit('roomUpdate', {
            roomId,
            userCount: users.size,
          });
        }
      }
      this.userRooms.delete(client.id);
    }
    
    console.log(`${username} disconnected`);
    this.clients.delete(client.id);
  }

  private async sendRoomsList(client: Socket) {
    const rooms = await this.chatroomService.findAll();
    const roomsWithCounts = rooms.map(room => ({
      ...room,
      userCount: this.roomUsers.get(room.id)?.size || 0,
    }));
    client.emit('roomsList', roomsWithCounts);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: number },
  ) {
    const oldRoomId = this.userRooms.get(client.id);
    
    // Leave old room
    if (oldRoomId !== undefined) {
      const oldUsers = this.roomUsers.get(oldRoomId);
      if (oldUsers) {
        oldUsers.delete(client.id);
        this.server.emit('roomUpdate', {
          roomId: oldRoomId,
          userCount: oldUsers.size,
        });
      }
    }

    // Join new room
    const roomId = payload.roomId;
    if (!this.roomUsers.has(roomId)) {
      this.roomUsers.set(roomId, new Set());
    }
    this.roomUsers.get(roomId)!.add(client.id);
    this.userRooms.set(client.id, roomId);

    // Broadcast updated user count
    const userCount = this.roomUsers.get(roomId)!.size;
    this.server.emit('roomUpdate', {
      roomId,
      userCount,
    });
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { name?: string; description?: string; icon?: string },
  ) {
    // If no name provided, generate one
    let roomName = payload.name?.trim();
    if (!roomName) {
      const allRooms = await this.chatroomService.findAll();
      const roomNumbers = allRooms
        .map(room => {
          const match = room.name.match(/^Room(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(num => num > 0);
      const nextNumber = roomNumbers.length > 0 ? Math.max(...roomNumbers) + 1 : 1;
      roomName = `Room${nextNumber}`;
    }
    
    const newRoom = await this.chatroomService.create(
      roomName,
      payload.description,
      payload.icon,
    );
    
    // Broadcast new room to all clients
    this.server.emit('newRoom', {
      ...newRoom,
      userCount: 0,
    });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { text: string; roomId: string },
  ) {
    const username = this.clients.get(client.id) || 'Unknown';
    const roomId = parseInt(payload.roomId, 10) || 1;
    
    // Save message to database
    try {
      await this.messageService.create(roomId, username, payload.text);
    } catch (error) {
      console.error('Error saving message to database:', error);
    }
    
    const msg = { 
      user: username, 
      text: payload.text,
      timestamp: Date.now()
    };
    this.server.emit('newMessage', msg); // Broadcast sa lahat
  }
}
