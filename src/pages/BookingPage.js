// src/pages/BookingPage.js
import React, { useEffect, useState } from 'react';

function BookingPage() {
  const [bookingList, setBookingList] = useState([]);
  const [error, setError] = useState(null);

  // สำหรับ create booking
  const [hotelId, setHotelId] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const token = localStorage.getItem('token') || '';

  // ดึง booking ของผู้ใช้
  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await fetch('http://localhost:3000/bookings', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Fetch bookings failed');
        }
        setBookingList(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMyBookings();
  }, [token]);

  // สร้าง booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ hotelId, checkInDate, checkOutDate }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Create booking failed');
      }
      setBookingList((prev) => [...prev, data]);
      setHotelId('');
      setCheckInDate('');
      setCheckOutDate('');
    } catch (err) {
      setError(err.message);
    }
  };

  // อัปเดต booking
  const handleUpdateBooking = async (bookingId) => {
    const newCheckIn = prompt('New CheckIn Date?', '2025-01-01');
    const newCheckOut = prompt('New CheckOut Date?', '2025-01-05');
    if (!newCheckIn || !newCheckOut) return;
    try {
      const res = await fetch(`http://localhost:3000/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ checkInDate: newCheckIn, checkOutDate: newCheckOut }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Update booking failed');
      }
      setBookingList((prev) => prev.map((b) => (b._id === bookingId ? data : b)));
    } catch (err) {
      setError(err.message);
    }
  };

  // ลบ booking
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`http://localhost:3000/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Delete booking failed');
      }
      setBookingList((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h2>My Bookings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleCreateBooking} style={{ marginBottom: '1rem' }}>
        <div>
          <label>HotelId: </label>
          <input
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>CheckIn: </label>
          <input
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            required
          />
        </div>
        <div>
          <label>CheckOut: </label>
          <input
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            required
          />
        </div>
        <button type="submit">Create Booking</button>
      </form>

      {bookingList.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookingList.map((b) => (
            <li key={b._id}>
              <p>HotelId: {b.hotelId}</p>
              <p>CheckIn: {b.checkInDate}</p>
              <p>CheckOut: {b.checkOutDate}</p>
              <p>Status: {b.status || 'N/A'}</p>
              <button onClick={() => handleUpdateBooking(b._id)}>Update</button>
              <button onClick={() => handleDeleteBooking(b._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookingPage;
