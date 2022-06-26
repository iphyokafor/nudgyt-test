import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Nudgyt-Test API')
    .setDescription('All API endpoints for nudgyt test')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs', app, document);

  app.enableCors();

  const port = process.env.PORT || 4001;

  await app.listen(port, () => {
    Logger.debug(`listening on port ${port} \nPress CTRL-C to stop`);
  });
}
bootstrap();
