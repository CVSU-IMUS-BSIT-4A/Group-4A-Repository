import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Global validation
  app.useGlobalPipes(new ValidationPipe())

  // Enable CORS so React frontend (localhost:3001) can access backend
  app.enableCors()

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Mini E-Commerce API')
    .setDescription('Products, Cart, Orders API')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const port = 3000
  await app.listen(port)
  console.log(`🚀 Backend running at: http://localhost:${port}`)
  console.log(`📚 Swagger UI: http://localhost:${port}/api`)
}

bootstrap()
