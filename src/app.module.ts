import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfiguration } from 'config/env.configuration';
import { TokenMiddleware } from './utils/middlewares/token.middleware';

@Module({
  imports: [

    UserModule,
    AuthModule,

    ConfigModule.forRoot({
      isGlobal: true,
      cache: false,
      envFilePath: ['.env'],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(
          envConfiguration.MONGODB_COMPASS,
        ),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: false,
      }),
      inject: [ConfigService],
    }),

  ],

  controllers: [AppController],
  providers: [AppService],

})
// JWT AUTHENTICATION
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(TokenMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
