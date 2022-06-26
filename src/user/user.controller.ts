import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto, UpdateUserProfileDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JoiObjectValidationPipe } from 'src/utils/pipes/validation.pipe';
import {
  createUserValidator,
  LoginValidator,
  UpdateUserValidator,
} from './validators/user.validator';
import { CreateUserPipe } from './pipes/user.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TokenDataDecorator } from 'src/utils/decorators/token.decorator';
import { TokenDto } from 'src/auth/dto/token.dto';
import { UpdateUserGuard } from './guards/user.guard';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiCreatedResponse({ type: CreateUserDto })
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  async register(
    @Body(new JoiObjectValidationPipe(createUserValidator), CreateUserPipe)
    user: CreateUserDto,
  ) {
    return await this.userService.register(user);
  }

  @Post('login')
  @ApiCreatedResponse({ type: LoginDto })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  async login(
    @Body(new JoiObjectValidationPipe(LoginValidator)) loginDto: LoginDto,
  ) {
    return await this.userService.login(loginDto);
  }

  @Get('get-users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CreateUserDto, isArray: true })
  async findAll() {
    return await this.userService.findAll();
  }

  @Patch('update-user-profile/:id')
  @UseGuards(UpdateUserGuard)
  async updateCustomerProfile(
    @TokenDataDecorator() tokenData: TokenDto,
    @Param('id') id: string,
    @Body(new JoiObjectValidationPipe(UpdateUserValidator))
    user: UpdateUserProfileDto,
  ) {
    await this.userService.updateProfile(id, user, tokenData);

    return {
      message: 'Updated successfully',
    };
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
