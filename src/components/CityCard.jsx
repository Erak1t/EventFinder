import { useState, useEffect } from "react";
import axios from "axios";
import WeatherTab from "./WeatherTab";
import EventsTab from "./EventsTab";

function CityCard({ city, onRemove }) {
  const [weather, setWeather] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("weather");

  useEffect(() => {
    // Перевірка пропа city
    if (
      !city ||
      typeof city !== "object" ||
      !city.name ||
      !city.startDate ||
      !city.endDate
    ) {
      console.error("Неправильний формат пропа city:", city);
      return; // Повертаємося без виконання запиту
    }
    // Завантажуємо погоду
    axios
      .get(
        `https://api.weatherapi.com/v1/forecast.json?key=1a44f68003bf4dcc919193903251103&q=${city.name}&days=3`
      )
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => console.error("Помилка API погоди:", error));

    // Завантажуємо події
    const TICKETMASTER_API_KEY = "Tmv5IBxk1vbIfSuS9U0vAzQABCLeiUES"; // Замініть на ваш ключ
    const startDate = `${city.startDate}T00:00:00Z`;
    const endDate = `${city.endDate}T23:59:59Z`;
    axios
      .get(
        `https://app.ticketmaster.com/discovery/v2/events.json?city=${encodeURIComponent(
          city.name
        )}&startDateTime=${startDate}&endDateTime=${endDate}&expand=venues,images&apikey=${TICKETMASTER_API_KEY}`
      )
      .then(async (response) => {
        console.log("Відповідь Ticketmaster:", response.data);
        let fetchedEvents = response.data._embedded?.events || [];

        // Додаємо координати через Nominatim, якщо їх немає
        for (let event of fetchedEvents) {
          if (
            !event._embedded?.venues?.[0]?.location?.latitude ||
            !event._embedded?.venues?.[0]?.location?.longitude
          ) {
            const venueName = event._embedded?.venues?.[0]?.name;
            if (venueName) {
              try {
                const nominatimResponse = await axios.get(
                  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    venueName + ", " + city.name
                  )}`
                );
                const location = nominatimResponse.data[0];
                if (location) {
                  if (!event._embedded.venues[0].location) {
                    event._embedded.venues[0].location = {};
                  }
                  event._embedded.venues[0].location.latitude = location.lat;
                  event._embedded.venues[0].location.longitude = location.lon;
                }
              } catch (error) {
                console.error(`Помилка геокодування для ${venueName}:`, error);
              }
            }
          }
        }

        console.log("Завантажені події з координатами:", fetchedEvents);
        setEvents(fetchedEvents);
      })
      .catch((error) => console.error("Помилка API Ticketmaster:", error));
  }, [city]);

  return (
    <div className="border p-4 rounded-lg shadow-mb">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {city.name} ({city.startDate} - {city.endDate})
        </h2>
        <button onClick={onRemove} className="text-red-500">
          Видалити
        </button>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setActiveTab("weather")}
          className={`p-2 rounded ${
            activeTab === "weather" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Погода
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`p-2 rounded ${
            activeTab === "events" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Події
        </button>
      </div>
      <div className="mt-4">
        {activeTab === "weather" && <WeatherTab weather={weather} />}
        {activeTab === "events" && <EventsTab events={events} />}
      </div>
    </div>
  );
}

export default CityCard;
