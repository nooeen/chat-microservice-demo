import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '@app/share/modules/redis/redis.service';
import { MICROSERVICE_KEYS, REDIS_HASH_KEYS, AUTH_COMMANDS, CustomWsExceptionsFilter, SOCKET_EVENTS } from '@app/share';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';

interface SocketPayload {
  username?: string;
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
        this.authClient.send({ cmd: AUTH_COMMANDS.VALIDATE_TOKEN }, { token: bearerToken.split(' ')[1] })
      );

      if (!validateToken) {
        console.log('Invalid token - disconnecting client');
        client.disconnect();
        return;
      }

      const username = validateToken.username;

      await this.addSocketId(username, client.id);

      console.log(`Connected with:`, username);

      const receiverSocketIds = await this.getSocketIds(username);
      console.log('receiverSocketIds', receiverSocketIds);
      if (receiverSocketIds)
        this.server.to(receiverSocketIds).emit('connected_instance', {
          instance: process.env.NODE_INSTANCE_ID,
      });

    } catch (error) {
      console.error('Error in handleConnection:', error);
      client.disconnect();
      return;
    }
  }

  // On User Disconnect
  async handleDisconnect(client: Socket) {
    const socketId = client.id;
    const username = await this.getUsername(socketId);
    const socketIds = await this.getSocketIds(username);

    if (socketIds) {
      const updatedSocketIds = socketIds.filter((id) => id !== socketId);

      if (updatedSocketIds.length > 0) {
        await this.redisService.hset(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, username, JSON.stringify(updatedSocketIds));
      } else {
        await this.redisService.hdel(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, username);
      }
    }
    await this.redisService.hdel(REDIS_HASH_KEYS.SOCKET_USER_MAPPING, socketId);

    console.log(`Disconnected with:`, username, client.id);
    return username;
  }

  @SubscribeMessage(SOCKET_EVENTS.PING)
  handlePing(client: Socket) {
    client.emit(SOCKET_EVENTS.PING, 'pong');
  }

  // Add socketId with username in Redis
  async addSocketId(username: string, socketId: string): Promise<void> {
    const socketIds = await this.getSocketIds(username);

    if (Array.isArray(socketIds) && socketIds.length) {
      socketIds.push(socketId);
      await this.redisService.hset(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, username, JSON.stringify(socketIds));
    } else {
      await this.redisService.hset(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, username, JSON.stringify([socketId]));
    }
    await this.redisService.hset(REDIS_HASH_KEYS.SOCKET_USER_MAPPING, socketId, JSON.stringify(username));
  }

  // Get socketId using username
  async getSocketIds(username: string): Promise<string[]> {
    const socketIdsQuery = await this.redisService.hget(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, username);
    return socketIdsQuery ? JSON.parse(socketIdsQuery) : [];
  }

  // Get username using socketId
  async getUsername(socketId: string): Promise<string> {
    const usernameQuery = await this.redisService.hget(REDIS_HASH_KEYS.SOCKET_USER_MAPPING, socketId);
    return usernameQuery ? JSON.parse(usernameQuery) : '';
  }

  // Utility functions for sending messages
  async sendMessageToAll(event: string, data: SocketPayload) {
    this.server.emit(event, data.message);
  }

  async sendMessageSpecificUser(event: string, data: SocketPayload) {
    const receiverSocketIds = await this.getSocketIds(data.username);
    if (receiverSocketIds) {
      receiverSocketIds.forEach((id) => {
        this.server.to(id).emit(event, data.message);
      });
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkOnlineUsers() {
    try {
      const allUserSocketMappings = await this.redisService.hgetall(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING);
      
      if (!allUserSocketMappings) return;

      // Check each user's socket connections
      for (const [username, socketIdsStr] of Object.entries(allUserSocketMappings)) {
        const socketIds: string[] = JSON.parse(socketIdsStr);
        const activeSocketIds = socketIds.filter(socketId => {
          const socket = this.server.sockets.sockets.get(socketId);
          return socket && socket.connected;
        });

        if (activeSocketIds.length === 0) {
          // If no active sockets, remove user from Redis
          await this.redisService.hdel(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, username);
          // Clean up socket-user mapping for all inactive sockets
          await Promise.all(socketIds.map(socketId => 
            this.redisService.hdel(REDIS_HASH_KEYS.SOCKET_USER_MAPPING, socketId)
          ));
        } else if (activeSocketIds.length !== socketIds.length) {
          // Update Redis with only active socket IDs
          await this.redisService.hset(
            REDIS_HASH_KEYS.USER_SOCKETS_MAPPING, 
            username, 
            JSON.stringify(activeSocketIds)
          );
          // Clean up socket-user mapping for inactive sockets
          const inactiveSocketIds = socketIds.filter(id => !activeSocketIds.includes(id));
          await Promise.all(inactiveSocketIds.map(socketId => 
            this.redisService.hdel(REDIS_HASH_KEYS.SOCKET_USER_MAPPING, socketId)
          ));
        }
      }

      // Get updated user list after cleanup
      const updatedMappings = await this.redisService.hgetall(REDIS_HASH_KEYS.USER_SOCKETS_MAPPING);
      const onlineUsers = updatedMappings ? Object.keys(updatedMappings) : [];
      const onlineUsersCount = onlineUsers.length;

      console.log(`Online users count: ${onlineUsersCount}`);
      console.log('Online users:', onlineUsers);

      // Emit online users count to all connected clients
      this.server.emit(SOCKET_EVENTS.ONLINE_USERS, {
        count: onlineUsersCount,
        users: onlineUsers
      });
    } catch (error) {
      console.error('Error checking online users:', error);
    }
  }
}