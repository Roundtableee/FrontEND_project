"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import style from "./page.module.css";
import Swal from "sweetalert2";
import { Rating } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function HotelInfoPage() {
  const { hid } = useParams();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // State for booking modal
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookCheckIn, setBookCheckIn] = useState(null);
  const [bookCheckOut, setBookCheckOut] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    if (!hid) return;
    if (!token) {
      setError("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    const fetchHotel = async () => {
      try {
        const res = await fetch(
          `https://backendproject-production-721b.up.railway.app/hotels/${hid}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Fetch hotel failed");
        }
        setHotel(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `https://backendproject-production-721b.up.railway.app/reviews?hotelId=${hid}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Fetch reviews failed");
        }
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    Promise.all([fetchHotel(), fetchReviews()]).finally(() =>
      setIsLoading(false)
    );
  }, [hid]);

  const handleRatingChange = async (hotelId, newRating) => {
    const token = localStorage.getItem("token") || "";
    if (!token) {
      setError("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    // optional optimistic update
    setHotel((prev) => (prev ? { ...prev, averageRating: newRating } : null));
    try {
      const res = await fetch(
        `https://backendproject-production-721b.up.railway.app/${hotelId}/rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating: newRating }),
        }
      );
      if (!res.ok) {
        throw new Error();
      }
      const updatedHotel = await res.json();
      setHotel((prev) =>
        prev ? { ...prev, averageRating: updatedHotel.averageRating } : null
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Show booking modal
  const handleOpenBookModal = () => {
    setBookCheckIn(null);
    setBookCheckOut(null);
    setShowBookModal(true);
  };

  const handleCloseBookModal = () => {
    setShowBookModal(false);
  };

  // Submit new booking from this modal
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || "";
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "กรุณาเข้าสู่ระบบก่อน",
        customClass: {
          popup: 'swal2-custom'
        }
      });
      return;
    }
    if (!bookCheckIn || !bookCheckOut) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "กรุณาเลือกวันที่",
        customClass: {
          popup: 'swal2-custom'
        }
      });
      return;
    }
    // Ensure checkOut is after checkIn
    if (bookCheckIn >= bookCheckOut) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "วันที่เช็คเอาท์ต้องอยู่หลังเช็คอิน",
        customClass: {
          popup: 'swal2-custom'
        }
      });
      return;
    }

    try {
      const res = await fetch(
        "https://backendproject-production-721b.up.railway.app/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hotelId: hid,
            checkIn: bookCheckIn.toISOString(),
            checkOut: bookCheckOut.toISOString(),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "การจองล้มเหลว");
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "จองโรงแรมสำเร็จ!",
        customClass: {
          popup: 'swal2-custom'
        }
      });
      setShowBookModal(false);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message,customClass: {
        popup: 'swal2-custom'
      }});
    }
  };

  if (isLoading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p className={style.error}>{error}</p>;
  if (!hotel) return <p>ไม่พบโรงแรม</p>;

  return (
    <div className={style.body}>
      <h2 className={style.header}>{hotel.name}</h2>
      <div className={style.detailContainer}>
        <img src={hotel.picture} alt={hotel.name} className={style.cardImg} />
        <div className={style.detailContent}>
          <p>
            <strong>ที่อยู่:</strong> {hotel.address}
          </p>
          <p>
            <strong>เขต/อำเภอ:</strong> {hotel.district}
          </p>
          <p>
            <strong>จังหวัด:</strong> {hotel.province}
          </p>
          <p>
            <strong>รหัสไปรษณีย์:</strong> {hotel.postalcode}
          </p>
          <p>
            <strong>เบอร์โทร:</strong> {hotel.phone}
          </p>
          <p>
            <strong>อัตราค่าห้อง:</strong> {hotel.dailyrate} THB
          </p>
          <Rating
            name={`rating-${hotel._id}`}
            value={hotel.averageRating}
            precision={1}
            onChange={(event, newValue) =>
              handleRatingChange(hotel._id, newValue)
            }
          />
          <button className={style.bookButton} onClick={handleOpenBookModal}>
            จองโรงแรม
          </button>
        </div>
      </div>

      <h3 className={style.reviewHeader}>รีวิว</h3>
      <div className={style.reviewContainer}>
        {reviews.length === 0 ? (
          <p>ไม่มีรีวิว</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className={style.reviewItem}>
              <p>
                <strong>{review.userId?.name || "User"}</strong>
              </p>
              <p>{review.comment}</p>
              <Rating
                name={`rev-${review._id}`}
                value={review.rating}
                precision={0.5}
                readOnly
              />
            </div>
          ))
        )}
      </div>

      {/* Booking Modal (React DatePicker) */}
      {showBookModal && (
        <div className={style.modalOverlay}>
          <div className={style.modalContainer}>
            <h2 className={style.modalTitle}>จองโรงแรม</h2>
            <form onSubmit={handleSubmitBooking}>
              <label className={style.modalLabel}>วันที่เช็คอิน:</label>
              <DatePicker
                selected={bookCheckIn}
                onChange={(date) => setBookCheckIn(date)}
                dateFormat="yyyy-MM-dd"
                className={style.modalDatePicker}
              />
              <label className={style.modalLabel}>วันที่เช็คเอาท์:</label>
              <DatePicker
                selected={bookCheckOut}
                onChange={(date) => setBookCheckOut(date)}
                dateFormat="yyyy-MM-dd"
                className={style.modalDatePicker}
              />
              <div className={style.modalActions}>
                <button
                  type="button"
                  className={style.modalCancelBtn}
                  onClick={handleCloseBookModal}
                >
                  ยกเลิก
                </button>
                <button type="submit" className={style.modalSubmitBtn}>
                  ตกลง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
