import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.enableCors({
    origin: 'http://localhost:3001',
  });

    const config = new DocumentBuilder()
    .setTitle('Todo List API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);


  await app.listen(3000);
  console.log('App is running at: http://localhost:3000/tasks');
  console.log('Swagger Docs available at: http://localhost:3000/api-docs');
}

bootstrap();
