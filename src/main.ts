import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Use static assets and views for chat module
  app.useStaticAssets(join(__dirname, '..', 'src', 'static'));
  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  app.setViewEngine('ejs');

  // Use cookieParser middleware for user module
  app.use(cookieParser());

  await app.listen(3000);
}

bootstrap();
