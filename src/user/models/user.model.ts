import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { mongooseSchemaConfig } from 'src/utils/database/schema.config';

export type UserDocument = User & Document;

@Schema(mongooseSchemaConfig)
export class User {

  @ApiProperty()
  @Prop({ minlength: 3, maxlength: 20, lowercase: true, required: true })
  firstName: string;

  @ApiProperty()
  @Prop({ minlength: 3, maxlength: 20, lowercase: true, required: true })
  lastName: string;

  @ApiProperty()
  @Prop({
    lowercase: true,
    maxlength: 200,
    required: true,
    trim: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  })
  email: string;

  @ApiProperty()
  @Prop({ trim: true, minlength: 10, required: true })
  password: string;

}

export const UserSchema = SchemaFactory.createForClass(User);