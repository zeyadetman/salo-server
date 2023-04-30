import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ORDER_STATUS, User, USER_TYPE } from '@prisma/client';
import { Server } from 'https';
import { EVENTS_TYPES } from 'src/events/events.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@WebSocketGateway()
@Injectable()
export class OrdersService {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}
  async create(createOrderDto: CreateOrderDto, user: Partial<User>) {
    const userType = user.type;
    if (userType !== USER_TYPE.BIKER) {
      throw new UnauthorizedException('Only bikers can create orders!');
    }

    const { parcelId, dropoffDate, pickupDate } = createOrderDto;
    const parcel = await this.prisma.parcel.findUnique({
      where: {
        id: parcelId,
      },
      include: {
        Order: true,
      },
    });

    if (!parcel) {
      throw new BadRequestException('Parcel not found!');
    }

    if (parcel.Order) {
      throw new BadRequestException(
        'There is already an order for this parcel!',
      );
    }

    const order = await this.prisma.order.create({
      data: {
        dropoffTime: dropoffDate,
        pickupTime: pickupDate,
        status: ORDER_STATUS.PICKED_UP,
        parcel: {
          connect: {
            id: parcelId,
          },
        },
        biker: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    this.server.emit(EVENTS_TYPES.ORDER_CREATED, order);
    this.server.emit(EVENTS_TYPES.PARCEL_UPDATED, {
      order,
      to: parcel.ownerId,
    });

    return order;
  }

  findAll(user: Partial<User>) {
    if (user.type !== USER_TYPE.BIKER) {
      throw new UnauthorizedException('Only bikers can see orders!');
    }

    return this.prisma.order.findMany({
      where: {
        bikerId: user.id,
      },
      include: {
        parcel: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    user: Partial<User>,
  ) {
    if (user.type !== USER_TYPE.BIKER) {
      throw new UnauthorizedException('Only bikers can update orders!');
    }

    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        parcel: true,
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found!');
    }

    if (order.bikerId !== user.id) {
      throw new UnauthorizedException(
        'You are not allowed to update this order!',
      );
    }

    if (updateOrderDto.status !== ORDER_STATUS.DROPPED_OFF) {
      throw new BadRequestException(
        'Updating Orders is only allowed to dropped off status!',
      );
    }

    if (order.status !== ORDER_STATUS.PICKED_UP) {
      throw new BadRequestException('Order is not in picked up status!');
    }

    const updatedOrder = await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status: ORDER_STATUS.DROPPED_OFF,
      },
    });

    this.server.emit(EVENTS_TYPES.ORDER_UPDATED, {
      order: updatedOrder,
      to: order.parcel.ownerId,
    });
    return updatedOrder;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
