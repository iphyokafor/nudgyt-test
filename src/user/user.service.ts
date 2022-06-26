import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { AuthService } from 'src/auth/auth.service';
import { PaginationDto } from 'src/utils/dtos/pagination.dto';
import { paginatedResult } from 'src/utils/functions/paginate.function';
import { LoginDto, UpdateUserProfileDto } from './dto/user.dto';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

   /**
   * This method registers a user
   * @param user
   * @returns
   */
  async register(user: User) {

    try {
      const { firstName, lastName, email, password } = user;

      const hashedPassword = await this.authService.hashPassword(password);

      const newUser = await this.userModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      const access_token = await this.authService.generateJwt({
        user: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      });

      const savedUser = await newUser.save();

      return {
        status: true,
        message: 'operation successful',
        savedUser,
        access_token,
      };

    } catch (error) {
      throw new BadRequestException(error.message);
    }

  }

   /**
   * This method enables a user to login
   * @param data
   * @returns
   */
  async login(data: LoginDto) {

    try {

      const { email, password } = data;

      const user = await this.userModel.findOne({
        email: email,
      });

      if (!user) {
        throw new NotFoundException('invalid credentials provided');
      }

      const isValidPassword = await this.authService.comparePassword(
        password,
        user.password,
      );

      if (!isValidPassword)
        throw new NotFoundException('invalid credentails provided');

      const access_token = await this.authService.generateJwt({
        user: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });

      return {
        status: true,
        message: 'operation successful',
        user,
        access_token,
      };

    } catch (error) {
      throw new BadRequestException(error.message);
    }

  }

   /**
   * This method returns all users
   * @returns
   */
  async search(
    query: PaginationDto,
    filter: FilterQuery<User>,
    sort?: Record<string, unknown>,
  ) {

    const result = await paginatedResult(
      query,
      filter,
      this.userModel,
      sort,
    );

    return result
  }

   /**
   * This method searches for a user by email
   * @param email
   * @returns
   */
  async findByEmail(email: string) {

    try {
      const user = await this.userModel.findOne({ email });

      if(!user) {
        throw new NotFoundException('Email does not exist');
      }

      return user;

    } catch (error) {
      throw new BadRequestException(error.message);
    }

  }

   /**
   * This method updates a user's profile
   * @param id
   * @param userData
   * @returns
   */
  async updateProfile(
    id: string,
    userData: UpdateUserProfileDto,
  ) {

    try {

      const foundUser = await this.userModel.findByIdAndUpdate(
        id,

        userData,

        {
          new: true,
        },

      );

      if (!foundUser) throw new NotFoundException('user not found');

      return foundUser;

    } catch (e) {
      throw new NotFoundException(e.message);
    }

  }

  /**
   * This method searches for a user by id
   * @param id
   * @returns
   */
  async findById(id: string) {

    try {
      const foundUser = await this.userModel.findById(id);

      if (!foundUser) throw new NotFoundException('user not found');

      return foundUser;

    } catch (error) {
      throw new BadRequestException(error.message);
    }

  }

}
