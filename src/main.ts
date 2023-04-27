import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true //receive only desire args
    })
  )
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(PORT);
}
bootstrap();
