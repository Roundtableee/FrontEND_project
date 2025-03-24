"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './globals.css';

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
      <body>
        {/* NavBar */}
        <nav className="m-4 space-x-4">
          {token ? (
            <button
              onClick={handleLogout}
              className="text-blue-600 underline"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="text-blue-600 underline">
              Login
            </Link>
          )}

          <Link href="/register">Register</Link>
          <Link href="/hotels">Hotels</Link>
          <Link href="/bookings">My Bookings</Link>

          {/* แสดง Admin Tools ถ้า role=admin และมี token */}
          {role === 'admin' && token && (
            <Link href="/admin-tool" className="text-red-500">
              Admin Tools
            </Link>
          )}
        </nav>

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
