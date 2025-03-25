"use client";

import React, { useEffect, useState } from 'react';
import style from './page.module.css';
import { Rating } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function HotelPage() {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      setError('You must login first.');
      setIsLoading(false); // Stop loading if no token
      return;
    }

    const fetchHotels = async () => {
      try {
        const res = await fetch('https://backendproject-production-721b.up.railway.app/hotels', {
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
      } finally {
        setIsLoading(false); // Stop loading after fetching data
      }
    };
    fetchHotels();
  }, []);

  const handleRatingChange = async (hotelId, newRating) => {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      setError('You must login first.');
      return;
    }

    setHotels((prevHotels) =>
      prevHotels.map((hotel) =>
        hotel._id === hotelId ? { ...hotel, averageRating: newRating } : hotel
      )
    );

    try {
      const res = await fetch(`https://backendproject-production-721b.up.railway.app/${hotelId}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating: newRating }),
      });

      if (!res.ok) {
        throw new Error();
      }

      const updatedHotel = await res.json();
      setHotels((prevHotels) =>
        prevHotels.map((hotel) =>
          hotel._id === hotelId ? { ...hotel, averageRating: updatedHotel.averageRating } : hotel
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={style.body}>
      <h2 className={style.header}>Hotels</h2>
      {error && <p className={style.error}>{error}</p>}
      {isLoading ? (
        <p>Loading hotels...</p>
      ) : (
        hotels.map((hotel) => (
          <div key={hotel._id} className={style.card}>
            <Image
              src={hotel.picture}
              alt='Hotel Image'
              width={300}
              height={200}
              className={style.cardImg}
            />
            <div className={style.cardContent}>
              <h4>{hotel.name}</h4>
              <p>📍 {hotel.district}, {hotel.province}</p>
              <p>📞 {hotel.phone}</p>
              <Rating
                name={`rating-${hotel._id}`}
                value={hotel.averageRating}
                precision={1}
                onChange={(event, newValue) => handleRatingChange(hotel._id, newValue)}
              />
              <p>THB {hotel.dailyrate}</p>
              <Link href={`/hotels/${hotel._id}`}>
                <button className={style.button}>View Details</button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
