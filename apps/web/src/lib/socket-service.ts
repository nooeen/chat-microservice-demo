import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_API_URL, {
        auth: {
          token: `Bearer ${token}`
        },
        transports: ['websocket'],
        upgrade: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService(); 