"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './globals.css';
import style from './layout.module.css';

export default function RootLayout({ children }) {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');

  const handleAuthChange = () => {
    const t = localStorage.getItem('token') || '';
    setToken(t);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        setRole(userObj.role || '');
      } catch (err) {
        console.error('Error parsing user JSON:', err);
        localStorage.removeItem('user');
        setRole('');
      }
    } else {
      setRole('');
    }
  };

  useEffect(() => {
    handleAuthChange();
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChange'));
    alert('ออกจากระบบสำเร็จ!');
    router.push('/login');
  };

  return (
    <html lang="th">
      <body className={style.body}>
        <nav className={style.navbar}>
          <div className={style.navItems}>
            <Link href="/" className={style.navlink}>หน้าแรก</Link>
            <Link href="/hotels" className={style.navlink}>โรงแรม</Link>
            <Link href="/bookings" className={style.navlink}>การจอง</Link>
            {role === 'admin' && token && (
              <Link href="/admin-tool" className={style.adminlink}>Admin Tools</Link>
            )}
            {/* ไม่แสดงปุ่มสมัครสมาชิกถ้า login แล้ว */}
            {!token && (
              <Link href="/register" className={style.navlink}>สมัครสมาชิก</Link>
            )}
            {token ? (
              <button onClick={handleLogout} className={style.loglink}>ออกจากระบบ</button>
            ) : (
              <Link href="/login" className={style.loglink}>เข้าสู่ระบบ</Link>
            )}
          </div>
        </nav>
        <main className={style.mainContent}>
          {children}
        </main>
      </body>
    </html>
  );
}
