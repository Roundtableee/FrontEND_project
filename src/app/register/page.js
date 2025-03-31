"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import style from './page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // ถ้าผู้ใช้ล็อกอินอยู่แล้ว ให้ redirect ไปยังหน้าโรงแรม
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/hotels');
    }
  }, [router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setPhoneError('');

    // ตรวจสอบเบอร์โทร ต้องมี 10 หลัก
    if (phone.length !== 10) {
      setPhoneError('เบอร์โทรต้องมี 10 หลัก');
      return;
    }

    try {
      const res = await fetch('https://backendproject-production-721b.up.railway.app/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password, role: 'user' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'การสมัครสมาชิกล้มเหลว');
      }
      alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        <h2 className={style.header}>สมัครสมาชิก</h2>
        {error && <p className={style.error}>{error}</p>}
        <form onSubmit={handleRegister} className={style.form}>
          <div className={style.inputGroup}>
            <label className={style.label}>ชื่อ:</label>
            <input
              className={style.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={style.inputGroup}>
            <label className={style.label}>เบอร์โทร:</label>
            <input
              className={style.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {phoneError && <p className={style.error}>{phoneError}</p>}
          </div>
          <div className={style.inputGroup}>
            <label className={style.label}>อีเมล:</label>
            <input
              className={style.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={style.inputGroup}>
            <label className={style.label}>รหัสผ่าน:</label>
            <input
              className={style.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={style.submitButton}>
            สมัครสมาชิก
          </button>
        </form>
      </div>
    </div>
  );
}
