import React from "react";

function WeatherCard({ weather }) {
  // Function to pick Bootstrap icon class based on condition
  const getIconClass = (condition) => {
    if (!condition) return "bi bi-cloud";

    const lower = condition.toLowerCase();

    if (lower.includes("clear")) return "bi bi-moon-stars"; // clear night
    if (lower.includes("sun")) return "bi bi-brightness-high"; // sunny
    if (lower.includes("cloud")) return "bi bi-clouds"; // cloudy
    if (lower.includes("rain")) return "bi bi-cloud-rain"; // rainy
    if (lower.includes("thunder")) return "bi bi-cloud-lightning"; // thunder
    if (lower.includes("snow")) return "bi bi-snow"; // snowy
    if (lower.includes("mist") || lower.includes("fog"))
      return "bi bi-cloud-fog"; // foggy
    return "bi bi-cloud"; // default
  };

  return (
    <div className="weather-display">
      <h2 className="city">{weather.city}</h2>
      <h1 className="temp">{Math.round(weather.temperature)}°</h1>
      <i className={`${getIconClass(weather.condition)} weather-icon`}></i>
      <p className="condition">{weather.condition}</p>
    </div>
  );
}

export default WeatherCard;
