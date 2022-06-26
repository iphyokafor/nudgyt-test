import { Optional } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationDto } from "src/utils/dtos/pagination.dto";

export class CreateUserDto {
    
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

}

export class LoginDto {

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

}

export class UpdateUserProfileDto {

  @ApiPropertyOptional()
  firstName: string;

  @ApiPropertyOptional()
  lastName: string;

}

export class UserFilterDto extends PaginationDto {}
