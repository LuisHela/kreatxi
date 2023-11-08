import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user.entity';
import { Chat } from './chat.entity'; // Import Chat entity
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'kreatx_database',
      entities: [User, Chat], // Add Chat entity
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Chat]), // Add Chat repository
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'client'),
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}

export type MulterFile = Express.Multer.File;
