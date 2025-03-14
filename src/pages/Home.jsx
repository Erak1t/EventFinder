import { useState, useEffect } from "react";
import AddCityForm from "../components/AddCityForm";
import CityCard from "../components/CityCard";

function Home() {
  const [itinerary, setItinerary] = useState(() => {
    const savedItinerary = localStorage.getItem("travelItinerary");
    try {
      const parsed = savedItinerary ? JSON.parse(savedItinerary) : [];
      if (!Array.isArray(parsed)) {
        console.error("Збережений маршрут не є масивом:", parsed);
        return [];
      }
      const validItinerary = parsed.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          "city" in item &&
          "startDate" in item &&
          "endDate" in item
      );
      return validItinerary;
    } catch (error) {
      console.error("Помилка парсингу маршруту з localStorage:", error);
      return [];
    }
  });

  const [headerText, setHeaderText] = useState("Обреріть Місто та дату");

  useEffect(() => {
    localStorage.setItem("travelItinerary", JSON.stringify(itinerary));
    const headers = ["Події", "Подорожі", "Обреріть Місто та дату"]; // Масив текстів для циклу
    let currentIndex = 0; // Переносимо currentIndex всередину useEffect
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % headers.length; // Оновлюємо індекс
      setHeaderText(headers[currentIndex]);
    }, 2000);

    return () => clearInterval(interval); // Очищення інтервалу
  }, [itinerary]); // Додаємо headers до залежностей

  const addCity = (city, startDate, endDate) => {
    if (!city || !startDate || !endDate) {
      console.error("Неправильні дані для додавання міста:", {
        city,
        startDate,
        endDate,
      });
      return;
    }
    setItinerary([...itinerary, { city, startDate, endDate }]);
  };

  const removeCity = (index) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const clearItinerary = () => {
    setItinerary([]);
    localStorage.removeItem("travelItinerary");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(83deg, rgba(237,230,201,1) 0%, rgba(223,230,206,1) 100%)",
      }}
    >
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <h1
          className="text-3xl font-bold mb-4 text-spacegray transition-opacity duration-500"
          style={{ textShadow: "1px 1px 2px rgba(66, 68, 90, 1)" }}
        >
          {headerText}
        </h1>
        <div className="w-full max-w-md mb-4">
          <AddCityForm addCity={addCity} />
        </div>
        <button
          onClick={clearItinerary}
          className="bg-red-500 text-white p-2 rounded mb-4"
        >
          Очистити маршрут
        </button>
        <div className="w-full">
          <div className="grid gap-4">
            {itinerary.map((item, index) => (
              <CityCard
                key={index}
                city={{
                  name: item.city,
                  startDate: item.startDate,
                  endDate: item.endDate,
                }}
                onRemove={() => removeCity(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
