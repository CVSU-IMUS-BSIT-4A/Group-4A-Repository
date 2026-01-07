import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  // Load environment variables
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow frontend requests (React)
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Weather Proxy API')
    .setDescription('Proxy service to fetch current weather data from OpenWeatherMap and return temperature + condition')
    .setVersion('1.0')
    .addTag('weather')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger endpoint
  SwaggerModule.setup('api/docs', app, document);

  // Start the app
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Server running at: http://localhost:${port}`);
  console.log(`Swagger Docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
