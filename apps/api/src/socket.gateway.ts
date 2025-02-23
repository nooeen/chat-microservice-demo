import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '@app/share/modules/redis/redis.service';
import { MICROSERVICE_KEYS, REDIS_HASH_KEYS, AUTH_COMMANDS, CustomWsExceptionsFilter } from '@app/share';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'apps/api/src/guards/jwt.guard';

interface SocketPayload {
  userId?: string;
  message: any;
}

@WebSocketGateway()
@UseFilters(new CustomWsExceptionsFilter())
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(MICROSERVICE_KEYS.AUTH) private readonly authClient: ClientProxy, 
    private readonly redisService: RedisService
  ) {}

  async afterInit(server: any) {
    console.log('--------------------------------');
    console.log('Socket Gateway Initialized');
    console.log('--------------------------------');
  }

  // On User Connect
  async handleConnection(client: Socket) {
    const bearerToken = client.handshake.headers.authorization;

    try {
      const validateToken = await firstValueFrom(
        this.authClient.send({ cmd: AUTH_COMMANDS.VALIDATE_TOKEN }, { token: bearerToken })
      );

      if (!validateToken) {
        client.disconnect();
        throw new WsException('Invalid token');
      }

      const userId = client.handshake.query.userId;

      await this.addSocketId(userId as string, client.id);

      console.log(`Connected with:`, userId);

      const receiverSocketId = await this.getSocketId(userId as string);
      if (receiverSocketId)
        this.server.to(receiverSocketId).emit('connected_instance', {
          instance: process.env.NODE_INSTANCE_ID,
        });

    } catch (error) {
      client.disconnect();
      throw new WsException('Invalid token');
    }
  }

  // On User Disconnect
  async handleDisconnect(client: Socket) {
    const userId = await this.removeUserId(client.id);
    console.log(`Disconnected with:`, userId);
  }

  // Add socketId with userId in Redis
  async addSocketId(userId: string, socketId: string): Promise<void> {
    const socketIdsStr = await this.redisService.hget(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, userId);
    let socketIds = socketIdsStr ? JSON.parse(socketIdsStr) : [];

    if (Array.isArray(socketIds) && socketIds.length) {
      socketIds.push(socketId);
      await this.redisService.hset(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, userId, JSON.stringify([...new Set(socketIds)]), 3600);
    } else {
      await this.redisService.hset(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, userId, JSON.stringify([socketId]), 3600);
    }
    await this.redisService.hset(REDIS_HASH_KEYS.SOCKET_USER_MAPPING, socketId, userId, 3600);
  }

  // Get socketId using userId
  async getSocketId(userId: string): Promise<string[] | null> {
    const socketIds = await this.redisService.hget(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, userId);
    return socketIds ? JSON.parse(socketIds) : null;
  }

  // Get userId using socketId
  async getUserId(socketId: string): Promise<string | null> {
    return this.redisService.hget(REDIS_HASH_KEYS.SOCKET_USER_MAPPING, socketId);
  }

  // Remove socketId from user array OR
  // No active connection then remove userId from Redis
  async removeUserId(socketId: string): Promise<string> {
    const userId = await this.getUserId(socketId);
    const socketIdsStr = await this.redisService.hget(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, userId);
    const socketIds = socketIdsStr ? JSON.parse(socketIdsStr) : null;

    if (socketIds) {
      const updatedSocketIds = socketIds.filter((id) => id !== socketId);

      if (updatedSocketIds.length > 0) {
        await this.redisService.hset(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, userId, JSON.stringify(updatedSocketIds));
      } else {
        await this.redisService.hdel(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, userId);
      }
    }
    await this.redisService.hdel(REDIS_HASH_KEYS.SOCKET_USER_MAPPING, socketId);

    return userId;
  }

  // Utility functions for sending messages
  sendMessageToAll(event: string, data: SocketPayload) {
    this.server.emit(event, data.message);
  }

  async sendMessageSpecificUser(event: string, data: SocketPayload) {
    const receiverSocketIds = await this.getSocketId(data.userId);
    if (receiverSocketIds) {
      receiverSocketIds.forEach((id) => {
        this.server.to(id).emit(event, data.message);
      });
    }
  }
}