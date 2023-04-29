import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ORDER_STATUS, User, USER_TYPE } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
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

    return await this.prisma.order.create({
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
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
