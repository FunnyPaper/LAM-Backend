import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RunEvent } from "./run.event";
import { AuthService } from "src/auth/auth.service";

@WebSocketGateway({
  cors: { origin: "*" },
  namespace: '/runs'
})
export class ScriptRunGateway implements OnGatewayConnection {
  public constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket,) {
    const token: string = client.handshake.auth?.token || client.handshake.headers?.token;

    if(!token) {
      client.disconnect();
      return;
    }

    try {
      const user = await this.authService.verify(token);

      if(!user) {
        client.disconnect();
        return;
      }

      client.data.user = user;
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('subscribeRun')
  async handleSubscribe(
    @MessageBody() body: { runId: string },
    @ConnectedSocket() client: Socket
  ) {
    const room = this.room(body.runId);
    await client.join(room);
    return { subscribed: body.runId };
  }

  @SubscribeMessage('unsubscribeRun')
  handleUnsubscribe(
    @MessageBody() body: { runId: string },
    @ConnectedSocket() client: Socket
  ) {
    return client.leave(this.room(body.runId));
  }

  emitRunEvent(runId: string, event: RunEvent) {
    this.server.to(this.room(runId)).emit('runEvent', event);
  }

  private room(runId: string) {
    return `run:${runId}`;
  }
}