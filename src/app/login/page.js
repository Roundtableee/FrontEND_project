"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import style from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ตรวจสอบว่ามี token อยู่ใน localStorage หรือไม่
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/hotels');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://backendproject-production-721b.up.railway.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'การเข้าสู่ระบบล้มเหลว');
      }
      // บันทึก token และข้อมูลผู้ใช้
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // แจ้งให้ Layout รู้ว่ามีการเปลี่ยนแปลงการเข้าสู่ระบบ
      window.dispatchEvent(new Event('authChange'));
      alert(`ยินดีต้อนรับ, ${data.user?.name || 'ผู้ใช้'}!`);
      router.push('/hotels');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        <h2 className={style.header}>เข้าสู่ระบบ</h2>
        {error && <p className={style.error}>{error}</p>}
        <form onSubmit={handleLogin} className={style.form}>
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
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
