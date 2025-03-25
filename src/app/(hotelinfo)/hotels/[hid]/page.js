"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import style from "./page.module.css";

export default function HotelInfoPage() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // ให้แน่ใจว่าหน้าโหลดบนไคลเอนต์ก่อน
  }, []);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id) return;
      const token = localStorage.getItem("token") || "";
      if (!token) {
        setError("You must login first.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/hotels/${id}`, {
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
  }, [id]);

  if (!isClient) return null; // ป้องกันการ Hydration error โดยไม่ให้ SSR โหลดหน้านี้

  if (error) return <p className="text-red-500 mb-4">{error}</p>;
  if (!hotel) return <p>Loading...</p>;

  return (
    <div className={style.body}>
      <h2 className={style.header}>Hotel Information</h2>
      <div className={style.card}>
        <h3 className="font-bold text-lg">{hotel.name}</h3>
        <p><strong>Address:</strong> {hotel.address}</p>
        <p><strong>District:</strong> {hotel.district}</p>
        <p><strong>Province:</strong> {hotel.province}</p>
        <p><strong>Postal Code:</strong> {hotel.postalcode}</p>
        <p><strong>Daily Rate:</strong> {hotel.dailyrate} THB</p>
        <p><strong>Phone:</strong> {hotel.phone}</p>
      </div>
    </div>
  );
}