import { BadRequestError } from '@common/errors/CustomError';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/models/User';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const data = {
        email: 'test@test.fr',
        password: 'password',
        username: 'test',
      };
      const user = { ...data, id: 1 };

      mockAuthService.register.mockResolvedValue(user);

      await expect(controller.register(data)).resolves.toEqual(user);
      expect(mockAuthService.register).toHaveBeenCalledWith(data);
    });

    it('should throw an error if user already exists', async () => {
      const data = {
        email: 'test@test.fr',
        password: 'password',
        username: 'test',
      };

      mockAuthService.register.mockRejectedValue(
        new BadRequestError('User already exists'),
      );

      await expect(controller.register(data)).rejects.toThrow(BadRequestError);
      expect(mockAuthService.register).toHaveBeenCalledWith(data);
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const data = {
        email: 'test@test.fr',
        password: 'password',
      };
      const response = {
        success: true,
        message: 'Login successful',
        token: 'mocked-jwt-token',
      };

      mockAuthService.login.mockResolvedValue(response);

      await expect(controller.login(data)).resolves.toEqual(response);
      expect(mockAuthService.login).toHaveBeenCalledWith(data);
    });

    it('should throw an error if email or password is incorrect', async () => {
      const data = {
        email: 'test@test.fr',
        password: 'wrong-password',
      };

      mockAuthService.login.mockRejectedValue(
        new BadRequestError('Invalid email or password'),
      );

      await expect(controller.login(data)).rejects.toThrow(BadRequestError);
      expect(mockAuthService.login).toHaveBeenCalledWith(data);
    });
  });
});
