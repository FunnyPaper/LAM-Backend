import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class DynamicIoAdapter extends IoAdapter {
  private dynamicOrigin: string;

  constructor(app: INestApplicationContext, origin: string) {
    super(app);
    this.dynamicOrigin = origin;
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const optionsWithDynamicOrigin = {
      ...options,
      cors: {
        origin: this.dynamicOrigin,
        transports: ['polling', 'websocket'],
        credentials: true
      },
    };
    return super.createIOServer(port, optionsWithDynamicOrigin);
  }
}