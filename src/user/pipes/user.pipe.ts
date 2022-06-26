import { ConflictException, Injectable, PipeTransform } from "@nestjs/common";
import { CreateUserDto } from "../dto/user.dto";
import { UserService } from "../user.service";

@Injectable()
export class CreateUserPipe implements PipeTransform {
  constructor(
    private readonly userService: UserService,
  ) {}
  
  async transform(data: CreateUserDto) {
    const { email } = data;

    const emailExists = await this.userService.findByEmail(email);
    if (emailExists) throw new ConflictException('This email is already taken');
    return data;
  }
}