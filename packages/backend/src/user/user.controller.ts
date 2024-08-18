import {
  changePasswordSchema,
  ChangePasswordSchema,
  editUserSchema,
  EditUserSchema,
} from '@common/validations/user-schema';
import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(@Req() req) {
    return this.userService.getUser(req.user.id);
  }

  @Patch()
  @UsePipes(new ZodValidationPipe(editUserSchema))
  updateUser(@Req() req, @Body() data: EditUserSchema) {
    return this.userService.updateUser(req.user.id, data);
  }
}
