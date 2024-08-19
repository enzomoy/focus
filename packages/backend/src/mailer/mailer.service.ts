import { BadRequestError } from '@common/errors/CustomError';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { User } from 'src/models/User';
import { Repository } from 'typeorm';

@Injectable()
export class MailerService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: NestMailerService,
  ) {}

  private secret = process.env.JWT_SECRET;

  async sendResetMail(email: string) {
    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    const token = this.generateToken(user.email);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Test',
      template: 'reset-password',
      context: {
        name: user.username,
        resetLink: 'http://localhost:8080/reset-password?token=' + token,
      },
    });

    return { success: true, message: 'Email sent successfully' };
  }

  private generateToken(email: string): string {
    return sign(
      {
        email,
      },
      this.secret,
      {
        expiresIn: '1h',
      },
    );
  }
}
