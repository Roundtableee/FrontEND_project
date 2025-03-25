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

  // ฟังก์ชันโหลด token/role จาก localStorage
  function handleAuthChange() {
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
  }

  // เมื่อ Layout mount → อ่านค่าใน localStorage และ set event listener
  useEffect(() => {
    // โหลดค่าเริ่มต้น
    handleAuthChange();

    // ฟัง event "authChange" → re-run handleAuthChange()
    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // dispatch event เพื่อให้ re-render Layout (role, token = '')
    window.dispatchEvent(new Event('authChange'));

    alert('Logout success!');
    router.push('/login');
  };

  return (
    <html lang="en">
      <body className={style.body}>
        <nav className={style.navbar}>
            <Link href="/" className={style.navlink}>Home</Link>
            <Link href="/hotels" className={style.navlink}>Hotels</Link>
            <Link href="/bookings" className={style.navlink}>Bookings</Link>

            {/* แสดง Admin Tools ถ้า role=admin และมี token */}
            {role === 'admin' && token && (
              <Link href="/admin-tool" className={style.adminlink}>
                Admin Tools
              </Link>
            )}
            <Link href="/register" className={style.navlink}>Register</Link>
            {token ? (
              <button
                onClick={handleLogout}
                className={style.loglink}
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className={style.loglink}>
                Login
              </Link>
            )}
        </nav>

        
        {children}
      </body>
    </html>
  );
}
