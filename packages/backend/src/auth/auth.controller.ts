import { userSchema } from '@common/validations/user-schema';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { UserModel } from 'src/models/User';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(userSchema))
  register(@Body() user: UserModel) {
    return this.authService.register(user);
  }
}
