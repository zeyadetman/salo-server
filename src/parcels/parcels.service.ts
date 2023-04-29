import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User, USER_TYPE } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelDto } from './dto/update-parcel.dto';

@Injectable()
export class ParcelsService {
  constructor(private prisma: PrismaService) {}
  async create(createParcelDto: CreateParcelDto, user: Partial<User>) {
    const userType = user.type;
    if (userType !== USER_TYPE.SENDER) {
      throw new UnauthorizedException('Only senders can create parcels!');
    }

    if (
      !createParcelDto.pickupAddress ||
      !createParcelDto.dropoffAddress ||
      !createParcelDto.name
    ) {
      throw new BadRequestException('Please fill all the fields!');
    }

    if (createParcelDto.pickupAddress === createParcelDto.dropoffAddress) {
      throw new BadRequestException(
        'Pickup and dropoff address cannot be the same!',
      );
    }

    const { pickupAddress, dropoffAddress, name } = createParcelDto;
    const pickup = await this.prisma.address.upsert({
      where: {
        address: pickupAddress,
      },
      update: {},
      create: {
        address: pickupAddress,
      },
    });

    const dropOff = await this.prisma.address.upsert({
      where: {
        address: dropoffAddress,
      },
      update: {},
      create: {
        address: dropoffAddress,
      },
    });

    const parcel = await this.prisma.parcel.create({
      data: {
        name,
        pickup: {
          connect: {
            id: pickup.id,
          },
        },
        dropoff: {
          connect: {
            id: dropOff.id,
          },
        },
        owner: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    if (!parcel) {
      throw new BadRequestException('Something went wrong!');
    }

    return parcel;
  }

  findAll(user: Partial<User>) {
    const userType = user.type;
    if (userType === USER_TYPE.BIKER) {
      return this.prisma.parcel.findMany({
        where: {
          Order: {
            is: null,
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          pickup: {
            select: {
              address: true,
              id: true,
            },
          },
          dropoff: {
            select: {
              address: true,
              id: true,
            },
          },
          name: true,
          id: true,
        },
      });
    }

    if (userType === USER_TYPE.SENDER) {
      return this.prisma.parcel.findMany({
        where: {
          ownerId: user.id,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
    }

    throw new UnauthorizedException(
      'Only senders and bikers can view parcels!',
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} parcel`;
  }

  update(id: number, updateParcelDto: UpdateParcelDto) {
    return `This action updates a #${id} parcel`;
  }

  remove(id: number) {
    return `This action removes a #${id} parcel`;
  }
}
