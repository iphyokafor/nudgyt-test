import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JoiObjectValidationPipe } from 'src/utils/pipes/validation.pipe';
import { createUserValidator, LoginValidator } from './validators/user.validator';
import { CreateUserPipe } from './pipes/user.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body(new JoiObjectValidationPipe(createUserValidator), CreateUserPipe) user: CreateUserDto) {
    return await this.userService.register(user);
  }

  @Post('login')
  async login(@Body(new JoiObjectValidationPipe(LoginValidator)) loginDto: LoginDto) {
    return await this.userService.login(loginDto);
  }

  @Get('get-users')
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
