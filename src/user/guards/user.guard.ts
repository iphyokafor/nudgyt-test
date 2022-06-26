import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from 'express';
import { TokenDto } from "src/auth/dto/token.dto";
import { UserService } from "../user.service";

@Injectable()
export class UpdateUserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const response: Response = context.switchToHttp().getResponse();
      const { user }: TokenDto = response.locals.tokenData;
      const { id } = request.params;

      const foundUser = await this.userService.findById(id);
      console.log(user)

      if (foundUser.id !== user) {
        throw new UnauthorizedException(
          'Sorry, cannot update your profile at this time',
        );
      }
      return true;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}