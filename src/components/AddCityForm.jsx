import { useState } from "react";

function AddCityForm({ addCity }) {
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city && startDate && endDate) {
      addCity(city, startDate, endDate);
      setCity("");
      setStartDate("");
      setEndDate("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-lg mx-auto"
    >
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Назва міста (наприклад, London)"
        className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 placeholder-gray-400"
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Дата початку (ДД.ММ.РРРР)"
        className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="Дата закінчення (ДД.ММ.РРРР)"
        className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all"
      >
        Додати місто
      </button>
    </form>
  );
}

export default AddCityForm;
