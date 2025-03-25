"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import style from "./page.module.css";
import Link from "next/link";
import { Rating } from '@mui/material';

export default function HotelInfoPage() {
  const { hid } = useParams();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!hid) return;
      const token = localStorage.getItem("token") || "";
      if (!token) {
        setError("You must login first.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/hotels/${hid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Fetch hotel failed");
        }
        setHotel(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchHotel();
  }, [hid]);

  const handleRatingChange = async (hid,newRating) => {
    const token = localStorage.getItem("token") || "";
    if (!token) {
      setError("You must login first.");
      return;
    }
    setHotels((prevHotels) =>
      prevHotels.map((hotel) =>
        hotel._id === hid ? { ...hotel, averageRating: newRating } : hotel
      )
    );
  
    try {
      const res = await fetch(`https://backendproject-production-721b.up.railway.app/hotels/${hid}/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: newRating }),
      });
  
      if (!res.ok) {
        throw new Error();
      }
  
      const updatedHotel = await res.json();
      setHotel((prevHotel) => ({
        ...prevHotel,
        averageRating: updatedHotel.averageRating,
      }));
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (!isClient) return null;
  if (error) return <p className="text-red-500 mb-4">{error}</p>;
  if (!hotel) return <p>Loading...</p>;

  return (
    <div className={style.body}>
      <h2 className={style.header}>{hotel.name}</h2>
      <img src={hotel.picture} alt={hotel.name} className={style.cardImg} />
      <div className={style.card}>
        <div className={style.cardContent}>
          <p><strong>Address:</strong> {hotel.address}</p>
          <p><strong>District:</strong> {hotel.district}</p>
          <p><strong>Province:</strong> {hotel.province}</p>
          <p><strong>Postal Code:</strong> {hotel.postalcode}</p>
          <p><strong>Phone:</strong> {hotel.phone}</p>
          <p><strong>Daily Rate:</strong> {hotel.dailyrate} THB</p>
          <Rating
                name={`rating-${hotel._id}`}
                value={hotel.averageRating || 0}
                precision={1}
                onChange={(event, newValue) => handleRatingChange(hotel._id, newValue)}
          />
          <Link href={`/bookings`}>
          <button className={style.bookBtn}>Booking</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
