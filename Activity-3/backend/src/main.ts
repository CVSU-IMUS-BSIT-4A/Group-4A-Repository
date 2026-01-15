import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true 
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Bookshelf API')
    .setDescription('API for managing books, authors, and categories')
    .setVersion('1.0')
    .addTag('books')
    .addTag('authors')
    .addTag('categories')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('Bookshelf API is running on: http://localhost:3000');
  console.log('API Documentation: http://localhost:3000/api');
}
bootstrap();
