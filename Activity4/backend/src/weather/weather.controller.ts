import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation({ summary: 'Get weather data by city name' })
  @ApiQuery({ name: 'city', required: true, type: String })
  async getWeather(@Query('city') city: string) {
    return this.weatherService.getWeatherByCity(city);
  }
}
