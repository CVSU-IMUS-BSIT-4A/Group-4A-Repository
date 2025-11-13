import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherModule } from './weather/weather.module';
import * as dotenv from 'dotenv';


dotenv.config();


@Module({
imports: [
HttpModule,
TypeOrmModule.forRoot({
type: 'mysql',
host: process.env.DB_HOST || 'localhost',
port: parseInt(process.env.DB_PORT || '3306', 10),
username: process.env.DB_USER || 'root',
password: process.env.DB_PASS || '',
database: process.env.DB_NAME || 'activity4',
entities: [], // optional: add entities if you create logs
synchronize: true, // for dev only
}),
WeatherModule,
],
})
export class AppModule {}
