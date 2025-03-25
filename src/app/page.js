"use client";
import React, { useState, useEffect } from 'react';
import style from './page.module.css';
import Image from 'next/image';

export default function HomePage() {
  const banners = [
    '/img/banner1.jpg',
  ]
  const [index, setIndex] = useState(0);

  // ตั้งค่ารูปภาพเริ่มต้นแบบสุ่มเมื่อโหลดหน้า
  useEffect(() => {
    setIndex(Math.floor(Math.random() * banners.length));
  }, []);

  return (
    <div className={style.banner} onClick={() => setIndex((index + 1) % banners.length)}>
      <Image
        src={banners[index]}
        alt="cover"
        fill
        priority
        objectFit="cover"
        className={style.bannerImg}
      />
      <h1 className={style.bannerText1}>Hotel Booking</h1>
      <h3 className={style.bannerText2}>skibidi toilet</h3>
    </div>
  );
}
