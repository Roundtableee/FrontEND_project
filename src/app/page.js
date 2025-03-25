"use client";
import React from 'react';
import style from './page.module.css';
import Image from 'next/image';
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function HomePage() {

  const banners = [
    '/img/banner1.jpg',
  ]
  const [index, setIndex] = useState(0);

  return (
    <body>
      <div className={style.banner} onClick={() => { setIndex((index+1)%banners.length) }}>
        <Image src={banners[index%banners.length]} //banners[index%banners.length]
          alt='cover'
          fill
          priority
          objectFit='cover'
          className={style.bannerImg}/>
          <h1 className={style.bannerText1}>
            Hotel Booking
          </h1>
          <h3 className={style.bannerText2}>
            skibidi toilet
          </h3>
      </div>
    </body>
  );
}
