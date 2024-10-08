import { BadRequestError } from '@common/errors/CustomError';
import { Login, Register } from '@common/validations/auth-schema';
import { ValidateResetTokenSchema } from '@common/validations/resetpwd-schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { User } from 'src/models/User';
import { Repository } from 'typeorm';

type JwtPayload = {
  id: number;
  username: string;
  email: string;
};

type JwtResetPasswordPayload = {
  tokenEmail: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(data: Register) {
    const userExists = await this.userRepository.findOne({
      where: [{ email: data.email }],
    });

    if (userExists) {
      throw new BadRequestError('User already exists');
    }

    const salt = this.generateSalt();
    const hashedPassword = this.hashPassword(data.password, salt);

    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
      salt,
    });

    await this.userRepository.save(user);

    const token = this.generateJwtToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    return {
      success: true,
      message: 'User registered successfully',
      token,
    };
  }

  async login(data: Login) {
    const user = await this.userRepository.findOne({
      where: [{ email: data.email }],
    });

    if (!user) {
      throw new BadRequestError('Invalid email or password');
    }

    const hashedPassword = this.hashPassword(data.password, user.salt);

    if (hashedPassword !== user.password) {
      throw new BadRequestError('Invalid email or password');
    }

    this.setLastLogin(user);

    const token = this.generateJwtToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    return {
      success: true,
      message: 'Login successful',
      token,
    };
  }

  async validateResetToken(token: string) {
    try {
      const payload = verify(token, process.env.JWT_SECRET) as JwtPayload;

      return {
        isValid: true,
        payload,
      };
    } catch (error) {
      return {
        isValid: false,
      };
    }
  }

  async resetPassword(data: ValidateResetTokenSchema) {
    // Verify token
    const payload = verify(
      data.token,
      process.env.JWT_SECRET,
    ) as JwtResetPasswordPayload;

    if (!payload.tokenEmail) {
      throw new BadRequestError('Invalid token');
    }

    // Edit user password
    const user = await this.userRepository.findOne({
      where: { email: payload.tokenEmail },
    });

    if (!user) {
      throw new BadRequestError('Invalid token');
    }

    const salt = this.generateSalt();

    user.salt = salt;
    user.password = this.hashPassword(data.password, salt);

    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  private generateSalt() {
    return crypto.randomBytes(16).toString('hex');
  }

  private hashPassword(password: string, salt: string) {
    return crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
  }

  private generateJwtToken(payload: JwtPayload) {
    return sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  private setLastLogin(user: User) {
    user.last_login = new Date();
    this.userRepository.save(user);
  }
}
