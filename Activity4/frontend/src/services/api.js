const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';


export async function getWeather(city) {
if (!city) throw new Error('City is required');
const resp = await fetch(`${BACKEND_URL}/weather?city=${encodeURIComponent(city)}`);
if (!resp.ok) {
const errText = await resp.text();
throw new Error(`API error: ${resp.status} ${errText}`);
}
return resp.json();
}