"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import style from "./page.module.css";
import Link from "next/link";
import { Rating } from "@mui/material";

export default function HotelInfoPage() {
  const { hid } = useParams();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!hid) return;
      const token = localStorage.getItem("token") || "";
      if (!token) {
        setError("กรุณาเข้าสู่ระบบก่อน");
        return;
      }

      try {
        const res = await fetch(`https://backendproject-production-721b.up.railway.app/hotels/${hid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "ไม่สามารถดึงข้อมูลโรงแรมได้");
        }
        setHotel(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchHotel();
  }, [hid]);

  const handleRatingChange = async (hid, newRating) => {
    const token = localStorage.getItem("token") || "";
    if (!token) {
      setError("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    // Optimistic update สำหรับคะแนนโรงแรม
    setHotel(prevHotel => prevHotel ? { ...prevHotel, averageRating: newRating } : null);

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
      setHotel(prevHotel => prevHotel ? { ...prevHotel, averageRating: updatedHotel.averageRating } : null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isClient) return null;
  if (error) return <p className="text-red-500 mb-4">{error}</p>;
  if (!hotel) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div className={style.body}>
      <h2 className={style.header}>{hotel.name}</h2>
      <img src={hotel.picture} alt={hotel.name} className={style.cardImg} />
      <div className={style.card}>
        <div className={style.cardContent}>
          <p><strong>ที่อยู่:</strong> {hotel.address}</p>
          <p><strong>เขต/อำเภอ:</strong> {hotel.district}</p>
          <p><strong>จังหวัด:</strong> {hotel.province}</p>
          <p><strong>รหัสไปรษณีย์:</strong> {hotel.postalcode}</p>
          <p><strong>เบอร์โทร:</strong> {hotel.phone}</p>
          <p><strong>อัตราค่าห้อง:</strong> {hotel.dailyrate} THB</p>
          <Rating
            name={`rating-${hotel._id}`}
            value={hotel.averageRating}
            precision={1}
            onChange={(event, newValue) => handleRatingChange(hotel._id, newValue)}
          />
          <Link href={`/bookings`}>
            <button className={style.bookBtn}>จองห้องพัก</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
