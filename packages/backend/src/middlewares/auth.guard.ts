import { UnauthorizedError } from '@common/errors/CustomError';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard {
  private readonly secret: string = process.env.JWT_SECRET;

  canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest();

      const token = req.cookies.focus_token;

      if (!token) {
        throw new UnauthorizedError('Invalid or missing token');
      }

      const decoded = verify(token, this.secret);

      if (!decoded) {
        throw new UnauthorizedError('Invalid or missing token');
      }

      req.user = decoded as JwtPayload;
      return true;
    } catch (error) {
      throw new UnauthorizedError('Invalid or missing token');
    }
  }
}
