"use client";

import React, { useState, useEffect } from 'react';
import style from './page.module.css';
import Image from 'next/image';

export default function HomePage() {
  // กำหนด array ของรูป banner (สามารถเพิ่มรูปได้ตามต้องการ)
  const banners = [
    '/img/banner1.jpg',
    '/img/banner2.jpg',
  ];
  const [index, setIndex] = useState(0);

  // ตั้งค่ารูปภาพเริ่มต้นแบบสุ่มเมื่อโหลดหน้า
  useEffect(() => {
    setIndex(Math.floor(Math.random() * banners.length));
  }, [banners.length]);

  // เมื่อคลิกที่ banner จะเปลี่ยนรูปภาพ
  const handleBannerClick = () => {
    setIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  return (
    <div className={style.banner} onClick={handleBannerClick}>
      <Image
        src={banners[index]}
        alt="Cover Image"
        fill
        priority
        objectFit="cover"
        className={style.bannerImg}
      />
      {/* Overlay เพื่อความโดดเด่นของข้อความ */}
      <div className={style.overlay}></div>
      <div className={style.bannerContent}>
        <h1 className={style.bannerText1}>Hotel Booking</h1>
        <h3 className={style.bannerText2}>Skibidi Toilet</h3>
      </div>
    </div>
  );
}
