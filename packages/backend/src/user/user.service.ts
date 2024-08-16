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

  async getAllUsers() {
    const users = await this.userRepository.find({
      select: ['id', 'username', 'email', 'is_active'],
    });

    if (users.length === 0) {
      return {
        success: false,
        message: 'No users found',
      };
    }

    return {
      success: true,
      users,
    };
  }
}
