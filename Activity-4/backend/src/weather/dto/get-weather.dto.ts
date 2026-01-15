import { IsString } from 'class-validator';


export class GetWeatherDto {
@IsString()
city: string;
}