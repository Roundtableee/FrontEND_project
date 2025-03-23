// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// สมมติว่าคุณสร้างไฟล์ .jsx ในโฟลเดอร์ src/pages/
// ชื่อ RegisterPage.jsx, LoginPage.jsx, HotelPage.jsx, BookingPage.jsx
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HotelPage from './pages/HotelPage';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <BrowserRouter>
      {/* ตัวอย่างเมนูนำทาง (NavBar) แบบเรียบง่าย */}
      <nav style={{ margin: '1rem' }}>
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
        <Link to="/hotels" style={{ marginRight: '1rem' }}>Hotels</Link>
        <Link to="/bookings">My Bookings</Link>
      </nav>

      {/* กำหนดเส้นทาง (Route) */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/hotels" element={<HotelPage />} />
        <Route path="/bookings" element={<BookingPage />} />
        
        {/* ถ้า path ไม่ตรงไหนเลย ให้แสดง 404 */}
        <Route path="*" element={<div style={{ margin: '1rem' }}>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
