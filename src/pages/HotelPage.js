// src/pages/HotelPage.js
import React, { useEffect, useState } from 'react';

function HotelPage() {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch('http://localhost:3000/hotels', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
  }, [token]);

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Hotels</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {hotels.map((hotel) => (
          <li key={hotel._id}>
            <h4>{hotel.name}</h4>
            <p>Address: {hotel.address}</p>
            <p>Tel: {hotel.phone}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HotelPage;
