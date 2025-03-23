import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

// MUI Imports
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
  const token = localStorage.getItem('token') || '';
  const [error, setError] = useState(null);

  // List of Bookings
  const [bookingList, setBookingList] = useState([]);
  // List of Hotels
  const [hotels, setHotels] = useState([]);

  // Create form
  const [selectedHotel, setSelectedHotel] = useState('');
  const [checkIn, setCheckIn] = useState(null);      // Date object
  const [checkOut, setCheckOut] = useState(null);    // Date object

  // Fetch
  const fetchHotels = async () => {
    try {
      const res = await fetch('http://localhost:3000/hotels', {
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
      const res = await fetch('http://localhost:3000/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Fetch bookings failed');
      setBookingList(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchHotels();
    fetchBookings();
  }, [token]);

  if (!token) {
    return (
      <div style={{ margin: '2rem' }}>
        <h2>My Bookings</h2>
        <p>You must login first</p>
      </div>
    );
  }

  // Create Booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!selectedHotel || !checkIn || !checkOut) {
      alert('Please select hotel and date');
      return;
    }
    // แปลง Date Object เป็น ISO string แล้ว backend จะอ่านเป็น checkIn / checkOut
    const checkInISO = checkIn.toISOString();
    const checkOutISO = checkOut.toISOString();

    try {
      const res = await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          hotelId: selectedHotel,
          checkIn: checkInISO,     // เปลี่ยนเป็น checkIn (แทน checkInDate)
          checkOut: checkOutISO,   // เปลี่ยนเป็น checkOut (แทน checkOutDate)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Create booking failed');

      alert('Booking created!');
      // รีเฟรช Booking
      fetchBookings();
      // reset form
      setSelectedHotel('');
      setCheckIn(null);
      setCheckOut(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Delete booking?')) return;
    try {
      const res = await fetch(`http://localhost:3000/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete booking failed');

      alert('Deleted booking');
      fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  // Update Booking
  const handleUpdateBooking = async (booking) => {
    // Prompt date in "YYYY-MM-DD" format or you can do MUI Dialog
    const newCheckInStr = prompt('New CheckIn? (YYYY-MM-DD)', booking.checkIn?.slice(0,10));
    const newCheckOutStr = prompt('New CheckOut? (YYYY-MM-DD)', booking.checkOut?.slice(0,10));
    if (!newCheckInStr || !newCheckOutStr) return;

    try {
      const res = await fetch(`http://localhost:3000/bookings/${booking._id}`, {
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
      fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  // findHotelName
  const findHotelName = (hotelId) => {
    const h = hotels.find((ht) => ht._id === hotelId);
    return h ? h.name : `UnknownHotel(id=${hotelId})`;
  };

  // formatDate => d MMMM yyyy (1 มกราคม 2003)
  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    // Convert iso string to Date, then format
    return format(new Date(isoStr), 'd MMMM yyyy'); 
    // ถ้าอยากได้ภาษาไทยเต็มรูปแบบ อาจใช้ locale th
    // import { format } from 'date-fns'
    // import { th } from 'date-fns/locale'
    // return format(new Date(isoStr), 'd MMMM yyyy', { locale: th })
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h2>My Bookings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* CREATE BOOKING SECTION */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form onSubmit={handleCreateBooking} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
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
            renderInput={(params) => <TextField {...params} fullWidth style={{ marginTop: 8 }} />}
          />
          <DatePicker
            label="CheckOut"
            value={checkOut}
            onChange={(newVal) => setCheckOut(newVal)}
            renderInput={(params) => <TextField {...params} fullWidth style={{ marginTop: 8 }} />}
          />

          <Button type="submit" variant="contained" color="primary" style={{ marginTop: 8 }}>
            Create Booking
          </Button>
        </form>
      </LocalizationProvider>

      {/* BOOKING LIST */}
      {bookingList.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {bookingList.map((b) => (
            <div key={b._id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
              <p><strong>Hotel:</strong> {findHotelName(b.hotelId)}</p>
              <p><strong>CheckIn:</strong> {formatDate(b.checkIn)}</p>
              <p><strong>CheckOut:</strong> {formatDate(b.checkOut)}</p>
              <p><strong>Status:</strong> {b.status || 'N/A'}</p>
              <div style={{ marginTop: 8 }}>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => handleUpdateBooking(b)}
                  style={{ marginRight: 8 }}
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
