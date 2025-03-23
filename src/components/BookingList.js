// src/components/BookingList.js
import React from 'react';

export function BookingList({ bookingList, onUpdate, onDelete }) {
  if (bookingList.length === 0) {
    return <p className="text-gray-600">No bookings found.</p>;
  }

  return (
    <ul className="space-y-4 mt-4">
      {bookingList.map((b) => (
        <li key={b._id} className="p-3 border rounded shadow">
          <p><span className="font-medium">HotelId:</span> {b.hotelId}</p>
          <p><span className="font-medium">CheckIn:</span> {b.checkInDate}</p>
          <p><span className="font-medium">CheckOut:</span> {b.checkOutDate}</p>
          <p><span className="font-medium">Status:</span> {b.status || 'N/A'}</p>

          <div className="mt-2 space-x-2">
            <button
              onClick={() => onUpdate(b._id)}
              className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
            >
              Update
            </button>
            <button
              onClick={() => onDelete(b._id)}
              className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
