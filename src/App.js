// src/App.js
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HotelPage from './pages/HotelPage';
import  BookingPage  from './pages/BookingPage';

function App() {
  // เราสามารถใช้ useNavigate() ได้เลย เพราะถูกห่อด้วย BrowserRouter จาก index.js
  const navigate = useNavigate();

  // state token เพื่อเช็คว่าล็อกอินอยู่ไหม
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // ฟังก์ชัน logout
  const handleLogout = () => {
    // ลบ token/user จาก localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    alert('Logout success!');
    navigate('/login');
  };

  return (
    <div>
      {/* NavBar แบบง่าย */}
      <nav style={{ margin: '1rem' }}>
        {/* ถ้ามี token → แสดง Logout, ถ้าไม่มีก็แสดง Login */}
        {token ? (
          <span
            onClick={handleLogout}
            style={{ marginRight: '1rem', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
          >
            Logout
          </span>
        ) : (
          <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        )}

        <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
        <Link to="/hotels" style={{ marginRight: '1rem' }}>Hotels</Link>
        <Link to="/bookings">My Bookings</Link>
      </nav>

      {/* กำหนดเส้นทาง (Route) */}
      <Routes>
        <Route
          path="/login"
          // เมื่อ login สำเร็จ จะเรียก onLogin → อัปเดต token ใน state
          element={<LoginPage onLogin={() => setToken(localStorage.getItem('token') || '')} />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/hotels" element={<HotelPage />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="*" element={<div style={{ margin: '1rem' }}>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
