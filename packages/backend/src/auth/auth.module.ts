import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerService } from 'src/mailer/mailer.service';
import { User } from 'src/models/User';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, MailerService],
  controllers: [AuthController],
})
export class AuthModule {}
