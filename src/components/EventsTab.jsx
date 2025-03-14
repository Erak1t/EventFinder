import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

function EventsTab({ events }) {
  // Визначаємо власну іконку
  const customIcon = new L.Icon({
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
    iconSize: [25, 41], // Розмір іконки
    iconAnchor: [12, 41], // Точка прив'язки іконки
    popupAnchor: [1, -34], // Точка прив'язки Popup
    shadowSize: [41, 41], // Розмір тіні
  });
  // Функція для визначення центру карти (беремо першу подію з координатами)
  const getMapCenter = () => {
    const eventWithLocation = events.find(
      (event) =>
        event._embedded?.venues &&
        event._embedded.venues[0]?.location?.latitude &&
        event._embedded.venues[0]?.location?.longitude
    );

    if (eventWithLocation) {
      return [
        parseFloat(eventWithLocation._embedded.venues[0].location.latitude),
        parseFloat(eventWithLocation._embedded.venues[0].location.longitude),
      ];
    }
    // Якщо координат немає, використовуємо центр Лондона за замовчуванням
    return [51.5074, -0.1278]; // Координати Лондона
  };

  return (
    <div className="p-4 bg-lightblue-200 bg-opacity-90 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">Події</h2>
      {events.length > 0 ? (
        <>
          {/* Контейнер для подій у рядок із горизонтальною прокруткою */}
          <div className="flex  gap-4 flex-wrap  py-4 pl-11     ">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex-none w-64 bg-white border rounded-lg shadow-sm p-4"
              >
                {/* Зображення зверху */}
                {/* Зображення як посилання */}
                {event.images && event.images[0]?.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={event.images[0].url}
                      alt={event.name}
                      className="w-full h-32 object-cover rounded mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </a>
                )}
                {/* Текстові дані знизу */}
                <div className="text-sm">
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline font-semibold"
                  >
                    {event.name}
                  </a>
                  <p className="text-gray-600">
                    Дата:{" "}
                    {new Date(event.dates.start.localDate).toLocaleDateString()}
                  </p>
                  {event._embedded?.venues &&
                    event._embedded.venues[0]?.name && (
                      <p className="text-gray-600">
                        Місце: {event._embedded.venues[0].name}
                      </p>
                    )}
                  {event._embedded?.attractions &&
                    event._embedded.attractions[0]?.name && (
                      <p className="text-gray-600">
                        Виконавець: {event._embedded.attractions[0].name}
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Карта */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Події на карті</h3>
            <div className="h-96 w-full">
              <MapContainer
                center={getMapCenter()}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {events
                  .filter(
                    (event) =>
                      event._embedded?.venues &&
                      event._embedded.venues[0]?.location?.latitude &&
                      event._embedded.venues[0]?.location?.longitude
                  )
                  .map((event, index) => {
                    const lat = parseFloat(
                      event._embedded.venues[0].location.latitude
                    );
                    const lon = parseFloat(
                      event._embedded.venues[0].location.longitude
                    );
                    if (isNaN(lat) || isNaN(lon)) {
                      console.warn(
                        `Некоректні координати для події ${event.name}:`,
                        { lat, lon }
                      );
                      return null;
                    }
                    return (
                      <Marker
                        key={index}
                        position={[lat, lon]}
                        icon={customIcon}
                      >
                        <Popup>
                          <div>
                            <h4 className="font-semibold">{event.name}</h4>
                            <p>
                              Дата:{" "}
                              {new Date(
                                event.dates.start.localDate
                              ).toLocaleDateString()}
                            </p>
                            <p>Місце: {event._embedded.venues[0].name}</p>
                            <a
                              href={event.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              Купити квитки
                            </a>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
              </MapContainer>
            </div>
          </div>
        </>
      ) : (
        <p>Події не знайдені.</p>
      )}
    </div>
  );
}

export default EventsTab;
