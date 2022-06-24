import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY
    });
  }

  // what is returned here is available in the req.user
  // TODO: Proper Error handling across api
  async validate(payload: any) {    
    const user = await this.userService.findByEmail(payload.email);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    
    return user
  }
}