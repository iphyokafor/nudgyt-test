import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  async register(createUserDto: CreateUserDto) {

    try {
      
      const { firstName, lastName, email, password } = createUserDto;

      const hashedPassword = await this.authService.hashPassword(password);

      const newUser = await this.userModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      const access_token = await this.authService.generateJwt(newUser);
      
      const savedUser = await newUser.save();

      const result = {
        savedUser,
        access_token,
      };

      return result;
    } catch (error) {
      throw new BadRequestException(error.message)
    }

  }

  async login(loginDto: LoginDto) {

    try {

      const result = await this.authService.login(loginDto) 

      return {
        status: true,
        message: "operation successful",
        data: result
      }
      
    } catch (error) {
      throw new BadRequestException(error.message)
    }

  }

  async findAll() {
    try {
      const result = await this.userModel.find()
      
      return {
        status: true,
        message: "operation successful",
        data: result
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });

      return user;
    } catch (error) {
      console.log('findByEmail', error);
    }
  }

}
