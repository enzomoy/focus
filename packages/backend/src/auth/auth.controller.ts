import {
  Login,
  loginSchema,
  Register,
  registerSchema,
} from '@common/validations/auth-schema';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { MailerService } from 'src/mailer/mailer.service';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { AuthService } from './auth.service';
import {
  ValidateResetTokenSchema,
  validateResetTokenSchema,
} from '@common/validations/resetpwd-schema';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(
    @Body() data: Register,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(data);
    res.cookie('focus_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() data: Login, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(data);
    res.cookie('focus_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return result;
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('focus_token');
    return { success: true, message: 'User logged out successfully' };
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body() data: { email: string }) {
    return this.mailerService.sendResetMail(data.email);
  }

  @Post('validate-reset-token')
  async validateResetToken(@Body('token') token: string) {
    return this.authService.validateResetToken(token);
  }

  @Post('reset-password')
  @UsePipes(new ZodValidationPipe(validateResetTokenSchema))
  async resetPassword(@Body() data: ValidateResetTokenSchema) {
    return this.authService.resetPassword(data);
  }
}
