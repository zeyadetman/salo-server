import { Module } from '@nestjs/common';
import { ParcelsService } from './parcels.service';
import { ParcelsController } from './parcels.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  controllers: [ParcelsController],
  providers: [ParcelsService, PrismaService, EventsGateway],
})
export class ParcelsModule {}
