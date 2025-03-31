"use client";

import React, { useEffect, useState } from 'react';
import style from './page.module.css';
import { Rating } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function HotelPage() {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    const fetchHotels = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch('https://backendproject-production-721b.up.railway.app/hotels', { headers });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'ไม่สามารถดึงข้อมูลโรงแรมได้');
        }
        setHotels(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleRatingChange = async (hotelId, newRating) => {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      setError('กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    // Optimistic update
    setHotels(prevHotels =>
      prevHotels.map(hotel =>
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
      setHotels(prevHotels =>
        prevHotels.map(hotel =>
          hotel._id === hotelId ? { ...hotel, averageRating: updatedHotel.averageRating } : hotel
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={style.body}>
      <h2 className={style.header}>โรงแรม</h2>
      {error && <p className={style.error}>{error}</p>}
      {isLoading ? (
        <p>กำลังโหลดข้อมูลโรงแรม...</p>
      ) : (
        hotels.map(hotel => (
          <div key={hotel._id} className={style.card}>
            <Image
              src={hotel.picture}
              alt={hotel.name}
              width={250}
              height={150}
              className={style.cardImg}
            />
            <div className={style.cardContent}>
              <h4 className={style.hotelName}>{hotel.name}</h4>
              <p className={style.hotelDetail}>📍 {hotel.district}, {hotel.province}</p>
              <p className={style.hotelDetail}>📞 {hotel.phone}</p>
              <Rating
                name={`rating-${hotel._id}`}
                value={hotel.averageRating}
                precision={1}
                onChange={(event, newValue) => handleRatingChange(hotel._id, newValue)}
              />
              <p className={style.hotelDetail}>THB {hotel.dailyrate}</p>
              <Link href={`/hotels/${hotel._id}`}>
                <button className={style.button}>ดูรายละเอียด</button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
