 = @'  
import { NestFactory } from '@nestjs/core';  
import { AppModule } from './app.module';  
import { ValidationPipe } from '@nestjs/common';  
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';  
  
async function bootstrap() {  
  const app = await NestFactory.create(AppModule);  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));  
  app.enableCors();  
  
  const config = new DocumentBuilder()  
    .setTitle('Activity5 Blog API')  
    .setDescription('API docs for users, posts, comments, and auth')  
    .setVersion('1.0')  
    .addBearerAuth()  
    .build();  
  const doc = SwaggerModule.createDocument(app, config);  
  SwaggerModule.setup('api', app, doc);  
  
  await app.listen(process.env.PORT ?? 3000);  
}  
bootstrap();  
'@  
Set-Content -Encoding UTF8 src\main.ts   
