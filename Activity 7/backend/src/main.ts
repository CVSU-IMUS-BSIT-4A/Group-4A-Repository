import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"],
  });

  // ✅ ENABLE GLOBAL VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes extra fields
      forbidNonWhitelisted: true, // error if extra fields
      transform: true, // REQUIRED for DTO transforms
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("Task Management API")
    .setDescription(
      "API for managing projects, tasks, and users with deadlines and status",
    )
    .setVersion("1.0")
    .addTag("projects", "Project management endpoints")
    .addTag("tasks", "Task management endpoints")
    .addTag("users", "User management endpoints")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);

  Logger.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  Logger.log(
    `Swagger API Documentation: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}

void bootstrap();
