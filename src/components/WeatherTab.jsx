function WeatherTab({ weather }) {
  if (!weather) return <p> Loading weather...</p>;

  return (
    <div>
      <h3 className="text-lg font-medium">Погода у ці дні</h3>
      {weather.forecast.forecastday.map((day) => (
        <div key={day.date} className="flex item-center gap-2 mt-2">
          <img src={day.day.condition.icon} alt="weather icon" />
          <p>
            {day.date}: {day.day.avgtemp_c}°C, {day.day.condition.text}
          </p>
        </div>
      ))}
    </div>
  );
}

export default WeatherTab;
