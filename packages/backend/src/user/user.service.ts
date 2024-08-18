import { EditUserSchema } from '@common/validations/user-schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/User';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(id: number) {
    const user = await this.userRepository.findOne({
      where: [{ id }],
      select: ['id', 'username', 'email', 'is_active'],
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      user,
    };
  }

  async updateUser(id: number, data: EditUserSchema) {
    const user = await this.userRepository.findOne({
      where: [{ id }],
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    if (!data.username && !data.email) {
      return {
        success: false,
        message: 'No data to update',
      };
    }

    await this.userRepository.update({ id }, data);

    return {
      success: true,
      message: 'User updated successfully',
    };
  }
}
