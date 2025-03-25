"use client";

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import style from './page.module.css';

// MUI
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField
} from '@mui/material';

import {
  DatePicker,
  LocalizationProvider
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function BookingPage() {
  const [error, setError] = useState(null);
  const [bookingList, setBookingList] = useState([]);
  const [hotels, setHotels] = useState([]);

  // ฟอร์มสร้าง booking
  const [selectedHotel, setSelectedHotel] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  // อ่าน token จาก localStorage
  const token = (typeof window !== 'undefined') ? localStorage.getItem('token')  : '';

  // ถ้าไม่มี token -> บอกให้ login ก่อน
  if (!token) {
    return (
      <div className="m-8">
        <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
        <p className="text-red-500">You must login first.</p>
      </div>
    );
  }

  // ฟังก์ชัน fetchHotels, fetchBookings
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

  const fetchBookings = async () => {
    try {
      const res = await fetch('https://backendproject-production-721b.up.railway.app/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Fetch bookings failed');
      setBookingList(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // โหลดข้อมูลครั้งแรก
  useEffect(() => {
    fetchHotels();
    fetchBookings();
  }, []);

  // สร้าง booking -> re-fetch
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedHotel || !checkIn || !checkOut) {
      alert('Please select hotel and date');
      return;
    }

    const checkInISO = checkIn.toISOString();
    const checkOutISO = checkOut.toISOString();

    try {
      const res = await fetch('https://backendproject-production-721b.up.railway.app/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          hotelId: selectedHotel,
          checkIn: checkInISO,
          checkOut: checkOutISO,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Create booking failed');

      alert('Booking created!');

      // re-fetch เพื่อให้รายการอัปเดต
      fetchBookings();

      // reset form
      setSelectedHotel('');
      setCheckIn(null);
      setCheckOut(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // ลบ booking -> re-fetch
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Delete booking?')) return;
    try {
      const res = await fetch(`https://backendproject-production-721b.up.railway.app/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete booking failed');

      alert('Deleted booking');
      // re-fetch
      fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  // แก้ไข booking -> re-fetch
  const handleUpdateBooking = async (booking) => {
    const newCheckInStr = prompt('New CheckIn? (YYYY-MM-DD)', booking.checkIn?.slice(0,10));
    const newCheckOutStr = prompt('New CheckOut? (YYYY-MM-DD)', booking.checkOut?.slice(0,10));
    if (!newCheckInStr || !newCheckOutStr) return;

    try {
      const res = await fetch(`https://backendproject-production-721b.up.railway.app/bookings/${booking._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          checkIn: newCheckInStr,
          checkOut: newCheckOutStr
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update booking failed');

      alert('Booking updated!');
      // re-fetch
      fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  // หา hotelName
  const findHotelName = (hotelId) => {
    const h = hotels.find((ht) => ht._id === hotelId);
    return h ? h.name : `UnknownHotel(id=${hotelId})`;
  };

  // format date
  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    return format(new Date(isoStr), 'd MMMM yyyy');
  };

  return (
    <div className={style.body}>
      <h2 className={style.header}>My Bookings</h2>
      {error && <p className={style.error}>{error}</p>}

      {/* ฟอร์มสร้าง Booking */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form
          onSubmit={handleCreateBooking}
          className={style.element2}
        >
          <FormControl fullWidth>
            <InputLabel id="hotel-label">Select Hotel</InputLabel>
            <Select
              labelId="hotel-label"
              label="Select Hotel"
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              >
              {hotels.map((ht) => (
                <MenuItem key={ht._id} value={ht._id}>
                  {ht.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DatePicker
            label="CheckIn"
            value={checkIn}
            onChange={(newVal) => setCheckIn(newVal)}
            renderInput={(params) => <TextField {...params} fullWidth />}
            />

          <DatePicker
            label="CheckOut"
            value={checkOut}
            onChange={(newVal) => setCheckOut(newVal)}
            renderInput={(params) => <TextField {...params} fullWidth />}
            />

          <Button type="submit" variant="contained" color="primary">
            Create Booking
          </Button>
        </form>
      </LocalizationProvider>

      {/* Booking List */}
      {bookingList.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className={style.element3}>
          {bookingList.map((b) => (
            <div key={b._id} className={style.element4}>
              <p><strong>Hotel:</strong> {findHotelName(b.hotelId)}</p>
              <p><strong>CheckIn:</strong> {formatDate(b.checkIn)}</p>
              <p><strong>CheckOut:</strong> {formatDate(b.checkOut)}</p>
              <p><strong>Status:</strong> {b.status || 'N/A'}</p>
              <div className={style.element5}>
                <Button
                  variant="outlined"
                  color="warning"
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
  );
}
