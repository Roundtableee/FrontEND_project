"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import style from "./page.module.css";
import Swal from "sweetalert2";
import { Rating } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function HotelInfoPage() {
  const { hid } = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // State for booking modal (custom)
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookCheckIn, setBookCheckIn] = useState(null);
  const [bookCheckOut, setBookCheckOut] = useState(null);

  // State for review submission modal (custom)
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // Check login token
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "โปรดเข้าสู่ระบบ",
      text: "กรุณาเข้าสู่ระบบก่อนดูรายละเอียดโรงแรม",
      customClass: { popup: "swal2-custom" }
    }).then(() => {
      router.push("/login");
    });
    return null;
  }

  // Fetch hotel details and reviews
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(
          `https://backendproject-production-721b.up.railway.app/hotels/${hid}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
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
        // Using query parameter as per your option 1
        const res = await fetch(
          `https://backendproject-production-721b.up.railway.app/reviews?hotelId=${hid}`,
          {
            headers: { "Content-Type": "application/json" }
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
  }, [hid, token, router]);

  // Handler for booking modal submission
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!bookCheckIn || !bookCheckOut) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "กรุณาเลือกวันที่"
      });
      return;
    }
    if (bookCheckIn >= bookCheckOut) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "วันที่เช็คเอาท์ต้องอยู่หลังเช็คอิน"
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
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            hotelId: hid,
            checkIn: bookCheckIn.toISOString(),
            checkOut: bookCheckOut.toISOString()
          })
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "การจองล้มเหลว");
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "จองโรงแรมสำเร็จ!",
        customClass: { popup: "swal2-custom" }
      });
      setShowBookModal(false);
      // Optionally, you can refresh the page or booking list
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message, customClass: { popup: "swal2-custom" } });
    }
  };

  // Handler for review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewRating <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "กรุณาให้คะแนน",
        customClass: { popup: "swal2-custom" }
      });
      return;
    }
    if (!reviewComment) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "กรุณากรอกความคิดเห็น",
        customClass: { popup: "swal2-custom" }
      });
      return;
    }
    try {
      const res = await fetch(
        "https://backendproject-production-721b.up.railway.app/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            hotelId: hid,
            rating: reviewRating,
            comment: reviewComment
          })
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to post review");
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "ส่งความคิดเห็นสำเร็จ!",
        customClass: { popup: "swal2-custom" }
      });
      setShowReviewModal(false);
      // Refresh reviews
      const reviewsRes = await fetch(
        `https://backendproject-production-721b.up.railway.app/reviews?hotelId=${hid}`,
        { headers: { "Content-Type": "application/json" } }
      );
      const reviewsData = await reviewsRes.json();
      if (reviewsRes.ok) setReviews(reviewsData);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message, customClass: { popup: "swal2-custom" } });
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
          <p><strong>ที่อยู่:</strong> {hotel.address}</p>
          <p><strong>เขต/อำเภอ:</strong> {hotel.district}</p>
          <p><strong>จังหวัด:</strong> {hotel.province}</p>
          <p><strong>รหัสไปรษณีย์:</strong> {hotel.postalcode}</p>
          <p><strong>เบอร์โทร:</strong> {hotel.phone}</p>
          <p><strong>อัตราค่าห้อง:</strong> {hotel.dailyrate} THB</p>
          <Rating
            name={`rating-${hotel._id}`}
            value={hotel.averageRating}
            precision={1}
            onChange={(event, newValue) =>
              console.log("New rating", newValue)
            }
          />
          <button className={style.bookButton} onClick={() => setShowBookModal(true)}>
            จองโรงแรม
          </button>
          <button className={style.reviewButton} onClick={() => setShowReviewModal(true)}>
            แสดงความคิดเห็น
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
              <p><strong>{review.userId?.name || "User"}</strong></p>
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

      {/* Custom Modal for Booking */}
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
                <button type="button" className={style.modalCancelBtn} onClick={handleCloseBookModal}>
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

      {/* Custom Modal for Review Submission */}
      {showReviewModal && (
        <div className={style.modalOverlay}>
          <div className={style.modalContainer}>
            <h2 className={style.modalTitle}>แสดงความคิดเห็น</h2>
            <form onSubmit={handleSubmitReview}>
              <label className={style.modalLabel}>คะแนนรีวิว (0-10):</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className={style.modalInput}
              />
              <label className={style.modalLabel}>ความคิดเห็น:</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className={style.modalTextarea}
              ></textarea>
              <div className={style.modalActions}>
                <button type="button" className={style.modalCancelBtn} onClick={() => setShowReviewModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className={style.modalSubmitBtn}>
                  ส่งความคิดเห็น
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
