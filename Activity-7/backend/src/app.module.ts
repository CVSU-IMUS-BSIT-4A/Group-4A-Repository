import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller'; // <-- added import
import { AppService } from './app.service';       // <-- added import

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'task.db',
      autoLoadEntities: true,
      // WARNING: Set synchronize to false in production and use migrations instead
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    ProjectsModule,
    TasksModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
