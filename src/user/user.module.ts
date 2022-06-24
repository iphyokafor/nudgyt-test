import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
  
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;

          schema.methods.toJSON = function() {
            const user = this;
            const userObject = user.toObject();
            
            delete userObject.password;
        
            return userObject;
        };

          return schema;
        },
      },
    ]),
  ],
  exports: [UserService]
})
export class UserModule {}
