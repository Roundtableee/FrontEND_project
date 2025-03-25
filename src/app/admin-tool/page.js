"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import styles from './adminToolStyle.module.css';

export default function AdminToolPage() {
  // อ่าน token / userObj จาก localStorage
  const token = (typeof window !== 'undefined') ? localStorage.getItem('token') || '' : '';
  const userStr = (typeof window !== 'undefined') ? localStorage.getItem('user') : null;
  const userObj = userStr ? JSON.parse(userStr) : null;

  // ถ้าไม่ใช่ admin → render พื้นหลังเหมือนกัน แต่บอกว่า "You are not admin!"
  if (!userObj || userObj.role !== 'admin') {
    return (
      <div className={styles.adminToolBackground}>
        <div className={styles.darkOverlay}></div>
        <div className={styles.contentWrapper}>
          <h2 className={styles.bigTitle}>Admin Tools</h2>
          <p className={styles.errorText}>You are not admin!</p>
        </div>
      </div>
    );
  }

  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);

  // ฟิลเตอร์
  const [userSearch, setUserSearch] = useState('');  // สำหรับกรองชื่อ user
  const [hotelFilter, setHotelFilter] = useState(''); // สำหรับกรองโรงแรม (hotelId)

  // ดึง booking + hotels
  useEffect(() => {
    if (!token) return;

    // ดึง bookings
    const fetchAllBookings = async () => {
      try {
        const res = await fetch('https://backendproject-production-721b.up.railway.app/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Fetch all bookings failed');
        setBookings(data);
      } catch (err) {
        setError(err.message);
      }
    };

    // ดึง hotels
    const fetchHotels = async () => {
      try {
        const res = await fetch('https://backendproject-production-721b.up.railway.app/hotels', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Fetch hotels failed');
        setHotels(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAllBookings();
    fetchHotels();
  }, [token]);

  // re-fetch bookings (ใช้หลัง update/delete)
  const reloadBookings = async () => {
    try {
      const res = await fetch('https://backendproject-production-721b.up.railway.app/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Fetch all bookings failed');
      setBookings(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update
  const handleUpdateBooking = async (booking) => {
    // ดึงแค่ส่วน YYYY-MM-DD จากเดิม (booking.checkIn)
    const defaultCheckIn = booking.checkIn ? booking.checkIn.slice(0,10) : '';
    const defaultCheckOut = booking.checkOut ? booking.checkOut.slice(0,10) : '';

    // prompt เฉพาะ YYYY-MM-DD
    const newCheckIn = prompt('New CheckIn (YYYY-MM-DD):', defaultCheckIn);
    const newCheckOut = prompt('New CheckOut (YYYY-MM-DD):', defaultCheckOut);
    if (!newCheckIn || !newCheckOut) return;

    try {
      const res = await fetch(`https://backendproject-production-721b.up.railway.app/bookings/${booking._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ checkIn: newCheckIn, checkOut: newCheckOut })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update booking failed');

      alert('Booking updated!');
      reloadBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure to delete booking?')) return;

    try {
      const res = await fetch(`https://backendproject-production-721b.up.railway.app/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete booking failed');

      alert('Booking deleted!');
      reloadBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  // หา hotelName จาก hotelId
  const findHotelName = (hotelId) => {
    const h = hotels.find((ht) => ht._id === hotelId);
    return h ? h.name : `Hotel(id=${hotelId})`;
  };

  // ฟิลเตอร์ bookings
  const filteredBookings = bookings.filter((b) => {
    // กรองตาม user name
    const userName = b.userId?.name?.toLowerCase() || '';
    const searchName = userSearch.toLowerCase();
    const matchUser = userName.includes(searchName);

    // กรองตาม hotel
    const matchHotel = hotelFilter ? (b.hotelId === hotelFilter) : true;

    return matchUser && matchHotel;
  });

  // ฟังก์ชัน formatDate -> ตัดเวลาออก แสดงแค่ YYYY-MM-DD
  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    return isoStr.slice(0,10); // ตัดเอาแค่ส่วน YYYY-MM-DD
  };

  return (
    <div className={styles.adminToolBackground}>
      <div className={styles.darkOverlay}></div>
      <div className={styles.contentWrapper}>
        <h2 className={styles.bigTitle}>Admin Tools</h2>
        {error && <p className={styles.errorText}>{error}</p>}

        {/* Filter Area */}
        <div className={styles.filterArea}>
          {/* Search user */}
          <input
            type="text"
            placeholder="Search user name"
            className={styles.filterInput}
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />

          {/* Select hotel */}
          <select
            className={styles.filterSelect}
            value={hotelFilter}
            onChange={(e) => setHotelFilter(e.target.value)}
          >
            <option value="">-- All Hotels --</option>
            {hotels.map((ht) => (
              <option key={ht._id} value={ht._id}>
                {ht.name}
              </option>
            ))}
          </select>
        </div>

        {/* Booking List */}
        {filteredBookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div>
            {filteredBookings.map((b) => (
              <div key={b._id} className={styles.bookingCard}>
                <p>
                  <strong>User:</strong> {b.userId?.name || 'NoUserName'} 
                  {' '}({b.userId?.email || 'NoEmail'})
                </p>
                <p><strong>Hotel:</strong> {findHotelName(b.hotelId)}</p>
                {/* ตรงนี้ใช้ formatDate เพื่อตัดเวลาออก */}
                <p><strong>CheckIn:</strong> {formatDate(b.checkIn)}</p>
                <p><strong>CheckOut:</strong> {formatDate(b.checkOut)}</p>
                <div className="mt-2 space-x-2">
                  <Button
                    variant="outlined"
                    color="warning"
                    className={styles.customButton}
                    onClick={() => handleUpdateBooking(b)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteBooking(b._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}