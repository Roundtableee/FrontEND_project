// src/components/BookingForm.js
import React, { useState } from 'react';

export function BookingForm({ onCreate }) {
  const [hotelId, setHotelId] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ hotelId, checkInDate, checkOutDate });
    // เคลียร์ฟอร์ม
    setHotelId('');
    setCheckInDate('');
    setCheckOutDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Create a New Booking</h3>
      
      <div className="mb-2">
        <label className="block font-medium">HotelId:</label>
        <input
          className="border p-1 rounded w-full"
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
          required
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">CheckIn:</label>
        <input
          className="border p-1 rounded w-full"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          placeholder="YYYY-MM-DD"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">CheckOut:</label>
        <input
          className="border p-1 rounded w-full"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          placeholder="YYYY-MM-DD"
          required
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700">
        Create Booking
      </button>
    </form>
  );
}
