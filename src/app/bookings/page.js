"use client";
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import style from './page.module.css';
import Swal from 'sweetalert2';

// MUI for Create Booking
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';

// React DatePicker for Update Booking (Custom Modal)
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function BookingPage() {
  const [error, setError] = useState('');
  const [bookingList, setBookingList] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  // State for custom modal (update booking)
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [bookingToUpdate, setBookingToUpdate] = useState(null);
  const [updateCheckIn, setUpdateCheckIn] = useState(null);
  const [updateCheckOut, setUpdateCheckOut] = useState(null);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  if (!token) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'กรุณาเข้าสู่ระบบก่อน',
      customClass: {
        popup: 'swal2-custom'
      }
    });
    return (
      <div className="m-8">
        <h2>การจองของฉัน</h2>
      </div>
    );
  }

  // Fetch Data
  const fetchHotels = async () => {
    try {
      const res = await fetch('https://backendproject-production-721b.up.railway.app/hotels', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'ไม่สามารถดึงข้อมูลโรงแรมได้');
      setHotels(data);
    } catch (err) {
      setError(err.message);
      Swal.fire({ icon: 'error', title: 'Error', text: err.message,
        customClass: {
          popup: 'swal2-custom'
        }
       });
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch('https://backendproject-production-721b.up.railway.app/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'ไม่สามารถดึงข้อมูลการจองได้');
      setBookingList(data);
    } catch (err) {
      setError(err.message);
      Swal.fire({ icon: 'error', title: 'Error', text: err.message,
        customClass: {
          popup: 'swal2-custom'
        }
       });
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchBookings();
  }, []);

  // Create Booking
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedHotel || !checkIn || !checkOut) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'กรุณาเลือกโรงแรมและวันที่',
        customClass: {
          popup: 'swal2-custom'
        }
      });
      return;
    }

    // Check that checkOut is after checkIn
    if (checkIn >= checkOut) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'วันที่เช็คเอาท์ต้องอยู่หลังเช็คอิน',
        customClass: {
          popup: 'swal2-custom'
        }
      });
      return;
    }

    try {
      const res = await fetch('https://backendproject-production-721b.up.railway.app/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          hotelId: selectedHotel,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'การจองล้มเหลว');
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'จองโรงแรมสำเร็จ!',
        customClass: {
          popup: 'swal2-custom'
        }
      });
      fetchBookings();
      setSelectedHotel('');
      setCheckIn(null);
      setCheckOut(null);
    } catch (err) {
      setError(err.message);
      Swal.fire({ icon: 'error', title: 'Error', text: err.message,
        customClass: {
          popup: 'swal2-custom'
        }
       });
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ?',
      text: 'คุณต้องการลบการจองนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก',
      customClass: {
        popup: 'swal2-custom'
      }
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(
        `https://backendproject-production-721b.up.railway.app/bookings/${bookingId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'ไม่สามารถลบการจองได้');
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'ลบการจองสำเร็จ',
        customClass: {
          popup: 'swal2-custom'
        }
      });
      fetchBookings();
    } catch (err) {
      setError(err.message);
      Swal.fire({ icon: 'error', title: 'Error', text: err.message,
        customClass: {
          popup: 'swal2-custom'
        }
       });
    }
  };

  // Open Update Modal
  const handleOpenUpdateModal = (booking) => {
    setBookingToUpdate(booking);
    setUpdateCheckIn(new Date(booking.checkIn));
    setUpdateCheckOut(new Date(booking.checkOut));
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setBookingToUpdate(null);
    setUpdateCheckIn(null);
    setUpdateCheckOut(null);
  };

  // Submit Update Booking
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!updateCheckIn || !updateCheckOut) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'กรุณาเลือกวันที่',
        customClass: {
          popup: 'swal2-custom'
        }
      });
      return;
    }
    // Check that checkOut is after checkIn
    if (updateCheckIn >= updateCheckOut) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'วันที่เช็คเอาท์ต้องอยู่หลังเช็คอิน',
        customClass: {
          popup: 'swal2-custom'
        }
      });
      return;
    }

    try {
      const res = await fetch(
        `https://backendproject-production-721b.up.railway.app/bookings/${bookingToUpdate._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            checkIn: updateCheckIn.toISOString().slice(0,10),
            checkOut: updateCheckOut.toISOString().slice(0,10)
          })
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'ไม่สามารถอัปเดตการจองได้');
      Swal.fire({ icon: 'success', title: 'สำเร็จ', text: 'อัปเดตการจองสำเร็จ!',customClass: {
        popup: 'swal2-custom'
      }});
      fetchBookings();
      handleCloseUpdateModal();
    } catch (err) {
      setError(err.message);
      Swal.fire({ icon: 'error', title: 'Error', text: err.message,customClass: {
        popup: 'swal2-custom'
      } });
    }
  };

  const findHotelName = (hotelId) => {
    const hotel = hotels.find(ht => ht._id === hotelId);
    return hotel ? hotel.name : `Unknown (ID: ${hotelId})`;
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    return format(new Date(isoStr), 'd MMMM yyyy');
  };

  return (
    <div className={style.body}>
      {/* Create Booking Form */}
      <h3 className={style.formHeader}>จองโรงแรม</h3>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form onSubmit={handleCreateBooking} className={style.bookingForm}>
          <FormControl fullWidth>
            <InputLabel id="hotel-label" className={style.formLabel}>เลือกโรงแรม</InputLabel>
            <Select
              labelId="hotel-label"
              label="เลือกโรงแรม"
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              className={style.formSelect}
            >
              {hotels.map((ht) => (
                <MenuItem key={ht._id} value={ht._id}>{ht.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className={style.dateGroup}>
            <MUIDatePicker
              label="เช็คอิน"
              value={checkIn}
              onChange={(newVal) => setCheckIn(newVal)}
              renderInput={(params) => <TextField {...params} fullWidth className={style.formInput} />}
            />
            <MUIDatePicker
              label="เช็คเอาท์"
              value={checkOut}
              onChange={(newVal) => setCheckOut(newVal)}
              renderInput={(params) => <TextField {...params} fullWidth className={style.formInput} />}
            />
          </div>
          <Button type="submit" variant="contained" color="primary" className={style.submitBtn}>
            จองโรงแรม
          </Button>
        </form>
      </LocalizationProvider>

      {/* Booking List */}
      <h3 className={style.myBookingHeader}>การจองของฉัน</h3>
      {error && <p className={style.error}>{error}</p>}
      {bookingList.length === 0 ? (
        <p className={style.noBooking}>ไม่มีการจอง</p>
      ) : (
        <div className={style.bookingList}>
          {bookingList.map((booking) => (
            <div key={booking._id} className={style.bookingCard}>
              <p className={style.bookingHotel}>
                <strong>โรงแรม:</strong> {findHotelName(booking.hotelId)}
              </p>
              <p className={style.bookingDate}>
                <strong>เช็คอิน:</strong> {formatDate(booking.checkIn)}
              </p>
              <p className={style.bookingDate}>
                <strong>เช็คเอาท์:</strong> {formatDate(booking.checkOut)}
              </p>
              <p className={style.bookingStatus}>
                <strong>สถานะ:</strong> {booking.status || 'N/A'}
              </p>
              <div className={style.bookingActions}>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => handleOpenUpdateModal(booking)}
                  className={style.actionBtn}
                >
                  แก้ไข
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteBooking(booking._id)}
                  className={style.actionBtn}
                >
                  ลบ
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Modal for Update Booking */}
      {showUpdateModal && (
        <div className={style.modalOverlay}>
          <div className={style.modalContainer}>
            <h2 className={style.modalTitle}>แก้ไขการจอง</h2>
            <form onSubmit={handleSubmitUpdate}>
              <label className={style.modalLabel}>วันที่เช็คอินใหม่:</label>
              <DatePicker
                selected={updateCheckIn}
                onChange={(date) => setUpdateCheckIn(date)}
                dateFormat="yyyy-MM-dd"
                className={style.modalDatePicker}
              />
              <label className={style.modalLabel}>วันที่เช็คเอาท์ใหม่:</label>
              <DatePicker
                selected={updateCheckOut}
                onChange={(date) => setUpdateCheckOut(date)}
                dateFormat="yyyy-MM-dd"
                className={style.modalDatePicker}
              />
              <div className={style.modalActions}>
                <button
                  type="button"
                  className={style.modalCancelBtn}
                  onClick={handleCloseUpdateModal}
                >
                  ยกเลิก
                </button>
                <button type="submit" className={style.modalSubmitBtn}>
                  อัปเดต
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
