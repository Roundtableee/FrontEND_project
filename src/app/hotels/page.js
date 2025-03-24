"use client";
import React, { useEffect, useState } from 'react';

export default function HotelPage() {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      setError('You must login first.');
      return;
    }

    const fetchHotels = async () => {
      try {
        const res = await fetch('http://localhost:3000/hotels', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Fetch hotels failed');
        }
        setHotels(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchHotels();
  }, []);

  return (
    <div className="m-8">
      <h2 className="text-xl font-semibold mb-4">Hotels</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul className="space-y-4">
        {hotels.map((hotel) => (
          <li key={hotel._id} className="border p-3 rounded">
            <h4 className="font-bold">{hotel.name}</h4>
            <p>Address: {hotel.address}</p>
            <p>Tel: {hotel.phone}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
