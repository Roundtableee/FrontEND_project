"use client";
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import style from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const banners = ['/img/banner.jpg'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * banners.length));
  }, []);

  return (
    <>
      <div className={style.banner}>
        <Image
          src={banners[index]}
          alt="Banner Image"
          fill
          priority
          objectFit="cover"
          style={{ objectFit: "cover",transform: "scale(1)" }}
        />
        <div className={style.overlay}></div>
        <div className={style.bannerContent}>
          <h1 className={style.title}>Hotel Booking</h1>
          <p className={style.slogan}>
            จองโรงแรมกับเราเพื่อสัมผัสประสบการณ์พักผ่อนที่หรูหรา สะดวกสบาย และคุ้มค่าที่สุดในทุกการเดินทางของคุณ
          </p>
        </div>
      </div>
      <div className={style.buttonSection}>
        <Link href="/hotels">
          <button className={style.button}>เลือกดูโรงแรม</button>
        </Link>
        <Link href="/bookings">
          <button className={style.button}>จองเลย</button>
        </Link>
      </div>
    </>
  );
}
