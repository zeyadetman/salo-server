import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ParcelsModule } from './parcels/parcels.module';
import { OrdersModule } from './orders/orders.module';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ParcelsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
