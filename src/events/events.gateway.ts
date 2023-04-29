import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'https';
import { JwtAuthGuard } from 'src/auth/auth.guard';

export enum EVENTS_TYPES {
  PARCEL_CREATED = 'parcelCreation',
  PARCEL_UPDATED = 'parcelUpdate',
  ORDER_CREATED = 'orderCreation',
  ORDER_UPDATED = 'orderUpdate',
}

@WebSocketGateway({
  cors: {
    credentials: true,
    methods: ['GET', 'POST'],
    origin: ['http://localhost:3001'],
  },
  transports: ['polling', 'websocket'],
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage(EVENTS_TYPES.PARCEL_CREATED)
  handleParcelCreationEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: any,
  ): string {
    return 'Parcel created!';
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage(EVENTS_TYPES.PARCEL_UPDATED)
  handleParcelUpdateEvent(@MessageBody() message: any, payload: any): string {
    console.log({ message, payload });
    return 'Parcel updated!';
  }

  @SubscribeMessage(EVENTS_TYPES.ORDER_CREATED)
  handleOrderCreationEvent(client: any, payload: any): string {
    return 'Order created!';
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage(EVENTS_TYPES.ORDER_UPDATED)
  handleOrderUpdateEvent(client: any, payload: any): string {
    return 'Order updated!';
  }
}
