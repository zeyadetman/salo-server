import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const config = new DocumentBuilder()
  .setTitle('Salo Delivery API')
  .setDescription('The API Documentaion for Salo Delivery App')
  .setVersion('1.0')
  .addTag('salo')
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
