import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:80'],
    credentials: true,
  });
  
  const config = new DocumentBuilder()
    .setTitle('Book Library Aggregator API')
    .setDescription('API для агрегатора поиска и бронирования книг в библиотеках')
    .setVersion('1.0')
    .addTag('auth', 'Аутентификация и авторизация')
    .addTag('users', 'Управление пользователями')
    .addTag('libraries', 'Библиотеки и книги')
    .addTag('rentals', 'Аренда книг')
    .addTag('support', 'Чат техподдержки')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT токен',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Library API Documentation',
  });
  
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  
  console.log(`��� Application is running on: http://localhost:${port}`);
  console.log(`��� Swagger documentation: http://localhost:${port}/api-docs`);
}

bootstrap();
