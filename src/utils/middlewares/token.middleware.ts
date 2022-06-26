import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { TokenDto } from 'src/auth/dto/token.dto';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
      
    if (!req.headers.authorization) return next();

    const authorizationHeader = req.headers.authorization;

    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer') {
      throw new NotFoundException('please provide a Bearer token');
    }

    if (!token) {
      throw new Notification('token not found');
    }

    const tokenData: TokenDto = await this.authService.verify(token);

    res.locals.tokenData = tokenData;
    next();
  }
}
