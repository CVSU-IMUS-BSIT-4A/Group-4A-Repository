import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // Configure body parser to handle larger payloads (for image uploads)
  const expressApp = app.getHttpAdapter().getInstance() as express.Application;
  expressApp.use(express.json({ limit: '10mb' }));
  expressApp.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Serve static files from uploads directory
  expressApp.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600,
  });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Event System API')
    .setDescription('API documentation for the Event System application')
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addTag('otp', 'OTP verification endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3005;
  // Listen on all network interfaces (0.0.0.0) to allow mobile access
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation available at: http://localhost:${port}/api`,
  );
  console.log(
    `\nTo access from mobile devices on the same network, use your computer's IP address:`,
  );
  console.log(`Example: http://192.168.x.x:${port}`);
}

void bootstrap();
