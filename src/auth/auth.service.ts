import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * This method validate a user on login
   * @param email 
   * @param pass 
   * @returns 
   */
  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email)

    const password = await this.comparePassword(pass, user.password)

    if (user && password) {
      const { password, ...result } = user;

      return result;
    } else {
      return null;
    }
  }

  /**
   * Generate jwt token for user login
   * @param user
   * @returns 
   */
  // async login(user: LoginDto) {
  //   const payload = { email: user.email };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }


  async generateJwt(tokenData: TokenDto) {
    const access_token = this.jwtService.sign(
      tokenData
    );
    return access_token;
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
  async comparePassword(password: string, hashPassword: string,) {
    const compareHash = await bcrypt.compare(password, hashPassword);
    return compareHash;
  }
}
