import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

export default function Reservations() {
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    showTime: "",
    showDate: "",
    movieId: "",
    screenId: "",
    seats: [],
    totalPrice: "",
    paymentId: "",
    paymentType: "",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/movie/getuserbookings",
        {
          withCredentials: true,
        }
      );
      if (response.data.ok) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      showTime: booking.showTime,
      showDate: booking.showDate,
      movieId: booking.movieId,
      screenId: booking.screenId,
      seats: booking.seats.join(", "),
      totalPrice: booking.totalPrice,
      paymentId: booking.paymentId,
      paymentType: booking.paymentType,
    });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:8000/movie/bookings/${selectedBooking._id}`;
      const response = await axios.put(url, formData, {
        withCredentials: true,
      });

      if (response.data.ok) {
        alert("Booking updated successfully!");
        fetchBookings();
        setFormData({
          showTime: "",
          showDate: "",
          movieId: "",
          screenId: "",
          seats: [],
          totalPrice: "",
          paymentId: "",
          paymentType: "",
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/movie/bookings/${bookingId}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.ok) {
          alert("Booking deleted successfully!");
          fetchBookings();
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Edit or Delete Bookings</h2>
        {isEditing && (
          <form onSubmit={handleUpdate}>
            <div>
              <label>Show Time:</label>
              <input
                type="time"
                name="showTime"
                value={formData.showTime}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Show Date:</label>
              <input
                type="date"
                name="showDate"
                value={formData.showDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Movie ID:</label>
              <input
                type="text"
                name="movieId"
                value={formData.movieId}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Screen ID:</label>
              <input
                type="text"
                name="screenId"
                value={formData.screenId}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Seats (comma-separated):</label>
              <input
                type="text"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Total Price:</label>
              <input
                type="number"
                name="totalPrice"
                value={formData.totalPrice}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Payment ID:</label>
              <input
                type="text"
                name="paymentId"
                value={formData.paymentId}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Payment Type:</label>
              <input
                type="text"
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Update Booking</button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  showTime: "",
                  showDate: "",
                  movieId: "",
                  screenId: "",
                  seats: [],
                  totalPrice: "",
                  paymentId: "",
                  paymentType: "",
                });
              }}
            >
              Cancel
            </button>
          </form>
        )}

        <h2>Reservations List</h2>
        {bookings.length > 0 ? (
          <ul>
            {bookings.map((booking) => (
              <li key={booking._id}>
                <p>
                  {booking.showDate} - {booking.showTime} | Movie ID:{" "}
                  {booking.movieId} | Screen ID: {booking.screenId}
                </p>
                <button onClick={() => handleEdit(booking)}>Edit</button>
                <button onClick={() => handleDelete(booking._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reservations available.</p>
        )}
      </div>
    </>
  );
}
