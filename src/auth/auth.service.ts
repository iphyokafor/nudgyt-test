import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { envConfiguration } from 'config/env.configuration';
import { UserService } from 'src/user/user.service';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * This method validate a user on login
   * @param email
   * @param pass
   * @returns
   */
  async validateUser(email: string, pass: string) {

    const user = await this.userService.findByEmail(email);

    const password = await this.comparePassword(pass, user.password);

    if (user && password) {
      const { password, ...result } = user;

      return result;

    } else {
      return null;
    }

  }

  /**
   * This method generates token
   * @param tokenData
   * @returns
   */
  async generateJwt(tokenData: TokenDto) {

    const access_token = this.jwtService.sign(tokenData);

    return access_token;

  }

  /**
   * This method verifies the access_token
   * @param access_token
   * @returns
   */
  verify(access_token: string): Promise<any> {

    return new Promise((resolve, reject) => {

      const tokenSecret = this.config.get(envConfiguration.JWT_SECRET_KEY);

      jwt.verify(access_token, tokenSecret, (err: { name: string; }, decoded: any) => {
        
        if (err) {

          // send custom code for expired token that the frontend can listen for
          if (err.name === 'TokenExpiredError') {

            throw new HttpException('jwt expired', HttpStatus.BAD_REQUEST);
          }

          reject(new UnauthorizedException(err));
        }

        resolve(decoded);

      });
    });
  }

  /**
   * This method verifies an expired access_token
   * @param access_token
   * @returns
   */
  verifyExpiredToken(access_token: string) {

    return new Promise((resolve, reject) => {

      const tokenSecret = this.config.get(envConfiguration.JWT_SECRET_KEY);

      jwt.verify(
        access_token,
        tokenSecret,
        { ignoreExpiration: true },
        (err, decoded) => {
          if (err) reject(new UnauthorizedException(err.message));
          resolve(decoded);
        },
      );
      
    });
  }

  /**
   * Method to hash user password
   * @param password
   * @returns
   */
  async hashPassword(password: string) {

    const hashPass = await bcrypt.hash(password, bcrypt.genSaltSync(10));

    return hashPass;
  }

  /**
   * Method to compare user password
   * @param hashPassword
   * @param password
   * @returns
   */
  async comparePassword(password: string, hashPassword: string) {

    const compareHash = await bcrypt.compare(password, hashPassword);

    return compareHash;
    
  }
}
