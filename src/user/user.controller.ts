import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto, LoginDto, UpdateUserProfileDto } from './dto/user.dto';
import { JoiObjectValidationPipe, JoiStringValidationPipe } from 'src/utils/pipes/validation.pipe';
import {
  createUserValidator,
  LoginValidator,
  objectIdValidator,
  UpdateUserValidator,
} from './validators/user.validator';
import { CreateUserPipe } from './pipes/user.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserGuard } from './guards/user.guard';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiCreatedResponse({ type: CreateUserDto, description: 'Your record has been created succsessfully' })
  @ApiBadRequestResponse()
  @ApiConflictResponse({description: 'This email is already taken'})
  async register(
    @Body(new JoiObjectValidationPipe(createUserValidator), CreateUserPipe)
    user: CreateUserDto,
  ) {
    return await this.userService.register(user);
  }

  @Post('login')
  @ApiCreatedResponse({ type: LoginDto, description: 'You have successfully logged in' })
  @ApiNotFoundResponse({description: 'Invalid credentials'})
  @ApiBadRequestResponse()
  async login(
    @Body(new JoiObjectValidationPipe(LoginValidator)) loginDto: LoginDto,
  ) {
    return await this.userService.login(loginDto);
  }

  @Get('get-users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: CreateUserDto, isArray: true , description: "Users fetched successfully"})
  async findAll() {
    return await this.userService.findAll();
  }

  @Patch('update-user-profile/:id')
  @UseGuards(UpdateUserGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  async updateCustomerProfile(
    @Param('id', new JoiStringValidationPipe(objectIdValidator.required())) id: string,
    @Body(new JoiObjectValidationPipe(UpdateUserValidator))
    user: UpdateUserProfileDto,
  ) {
    await this.userService.updateProfile(id, user);

    return {
      message: 'Updated successfully',
    };
  }

}
