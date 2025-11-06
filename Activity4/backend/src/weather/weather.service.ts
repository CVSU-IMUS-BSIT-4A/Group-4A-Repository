import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class WeatherService {
private apiKey = process.env.OWM_API_KEY || '';
private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';


constructor(private readonly httpService: HttpService) {}


async getWeatherByCity(city: string) {
if (!this.apiKey) {
throw new HttpException('OpenWeatherMap API key is not set', 500);
}


const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;


	try {
	const resp: AxiosResponse<any> = await firstValueFrom(this.httpService.get(url));
	const data = resp.data;


// pick temperature and condition
const temperature = data?.main?.temp;
const condition = data?.weather && data.weather[0] ? data.weather[0].main : null;


return { city: data.name, temperature, condition };
} catch (err) {
throw new HttpException('Failed to fetch weather: ' + (err?.response?.data?.message || err.message), 502);
}
}}