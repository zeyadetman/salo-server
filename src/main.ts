import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import configuration from 'src/config/configuration';
import { PrismaClientExceptionFilter } from 'src/prisma-client-exception/prisma-client-exception.filter';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from './app.module';

const config = new DocumentBuilder()
  .setTitle('Salo Delivery API')
  .setDescription('The API Documentaion for Salo Delivery App')
  .setVersion('1.0')
  .addTag('salo')
  .addBearerAuth()
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [configuration().bikerWebAppUrl, configuration().senderWebAppUrl],
  });
  app.enableVersioning();
  app.useWebSocketAdapter(new IoAdapter(app));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
