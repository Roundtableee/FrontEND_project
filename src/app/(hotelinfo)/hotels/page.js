"use client";

import React, { useEffect, useState } from 'react';
import style from './page.module.css';
import { Rating } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function HotelPage() {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // loading state

  useEffect(() => {
    const token = localStorage.getItem('token') || '';

    // ดึงข้อมูลโรงแรมจาก backend
    const fetchHotels = async () => {
      try {
        // ถ้า backend อนุญาตให้ GET /hotels ได้โดยไม่ต้องส่ง token ก็ส่ง headers แบบธรรมดา
        // แต่ถ้าจะเผื่อกรณีส่ง token เมื่อมี ก็สามารถทำแบบด้านล่าง
        const headers = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(
          'https://backendproject-production-721b.up.railway.app/hotels',
          { headers }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Fetch hotels failed');
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

  // ฟังก์ชันเปลี่ยน Rating
  const handleRatingChange = async (hotelId, newRating) => {
    const token = localStorage.getItem('token') || '';
    // ถ้าไม่มี token -> แจ้งเตือนว่า "You must login first."
    if (!token) {
      setError('You must login first.');
      return;
    }

    // optimistic update: แก้ค่า rating ใน state ชั่วคราว
    setHotels((prevHotels) =>
      prevHotels.map((hotel) =>
        hotel._id === hotelId ? { ...hotel, averageRating: newRating } : hotel
      )
    );

    try {
      const res = await fetch(
        `https://backendproject-production-721b.up.railway.app/${hotelId}/rating`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ rating: newRating }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      // ถ้าอัปเดต rating สำเร็จ -> ดึงค่า averageRating ใหม่จาก backend
      const updatedHotel = await res.json();
      setHotels((prevHotels) =>
        prevHotels.map((hotel) =>
          hotel._id === hotelId
            ? { ...hotel, averageRating: updatedHotel.averageRating }
            : hotel
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to update rating');
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
              alt="Hotel Image"
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