import {
  Login,
  loginSchema,
  Register,
  registerSchema,
} from '@common/validations/auth-schema';
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  register(@Body() data: Register) {
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(loginSchema))
  login(@Body() data: Login) {
    return this.authService.login(data);
  }
}
