import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MovieScreens.module.css";

// SeatSelection Component
function SeatSelection({ seats, selectedSeats, toggleSeatSelection }) {
  return (
    <div className={styles.seatGrid}>
      {seats.length === 0 ? (
        <p>No seats available for this show.</p>
      ) : (
        seats.map((seat, index) => (
          <div
            key={`${seat.seat_id}-${index}`} // Unique key for each seat
            className={`${styles.seat} ${
              seat.isBooked ? styles.bookedSeat : ""
            } ${
              selectedSeats.includes(seat) && !seat.isBooked
                ? styles.selectedSeat
                : ""
            }`}
            onClick={() => (!seat.isBooked ? toggleSeatSelection(seat) : null)}
          >
            {seat.seat_id}
          </div>
        ))
      )}
    </div>
  );
}

export default function MovieScreens() {
  const movieId = window.location.pathname.split("/").pop();

  const [city, setCity] = useState("Delhi");
  const [selectedDate, setSelectedDate] = useState("");
  const [screens, setScreens] = useState([]);
  const [futureDates, setFutureDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showSeatModal, setShowSeatModal] = useState(false);

  const generateFutureDates = () => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  useEffect(() => {
    setFutureDates(generateFutureDates());
  }, []);

  const handleCityChange = (e) => setCity(e.target.value);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchScreens = async () => {
      if (movieId && selectedDate && city) {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:8000/movie/screensbymovieschedule/Delhi/${selectedDate}/${movieId}`
          );
          if (response.data.ok) {
            setScreens(response.data.data);
          } else {
            console.error("Failed to fetch screens.");
          }
        } catch (error) {
          console.error("Error fetching screens:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (selectedDate) {
      fetchScreens();
    }
  }, [movieId, selectedDate, city]);

  const handleShowClick = (show, screenId) => {
    console.log("Show clicked:", show); // Debugging log
    setSelectedShow({ ...show, screenId }); // Pass the screenId explicitly
    fetchSeats(show._id);
  };

  const fetchSeats = async (showId) => {
    console.log("Fetching seats for show ID:", showId); // Debugging log
    try {
      const response = await axios.get(
        `http://localhost:8000/movie/schedulebymovie/${selectedShow.screenId}/${selectedShow.showDate}/${movieId}`
      );
      console.log("Seats response:", response.data); // Debugging log
      if (response.data.ok) {
        const { movieSchedulesforDate } = response.data.data;
        setSeats(movieSchedulesforDate[0].notAvailableSeats || []);
        setShowSeatModal(true);
      } else {
        console.error("Failed to fetch seats.");
      }
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };

  const toggleSeatSelection = (seat) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seat)
        ? prevSelected.filter((s) => s !== seat)
        : [...prevSelected, seat]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length > 0) {
      try {
        const totalPrice = selectedSeats.reduce(
          (total, seat) => total + seat.price,
          0
        );
        const bookingDetails = {
          showTime: selectedShow.showTime,
          showDate: selectedShow.showDate,
          movieId: selectedShow.movieId,
          screenId: selectedShow.screenId,
          seats: selectedSeats,
          totalPrice,
          paymentId: "FAKE_PAYMENT_ID", // In a real scenario, this would be generated after payment
          paymentType: "Credit Card", // Or any other payment type
        };

        const response = await axios.post(
          "http://localhost:8000/movie/bookticket",
          bookingDetails
        );

        if (response.data.ok) {
          alert("Booking successful!");
          setShowSeatModal(false);
          setSelectedSeats([]);
        } else {
          alert("Booking failed!");
        }
      } catch (error) {
        console.error("Error during booking:", error);
      }
    } else {
      alert("Please select at least one seat to book.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Available Movie Screens and Showtimes</h2>
      <div>
        <label className={styles.label}>Select City: </label>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          className={styles.input}
        />
      </div>
      <div>
        <label className={styles.label}>Select Date: </label>
        <div className={styles.dateButtonContainer}>
          {futureDates.map((date, index) => (
            <button
              key={`${date}-${index}`} // Unique key for each date button
              onClick={() => handleDateChange(date)}
              className={`${styles.dateButton} ${
                selectedDate === date ? styles.selected : ""
              }`}
            >
              {new Date(date).toLocaleDateString(undefined, {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.screenContainer}>
        <h3>Screens:</h3>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : screens.length === 0 ? (
          <p>No screens available for the selected movie and date.</p>
        ) : (
          screens.map((screen, index) => (
            <div key={`${screen._id}-${index}`} className={styles.screen}>
              <h4>
                {screen.name} - {screen.location}
              </h4>
              <p>Screen Type: {screen.screenType}</p>
              {screen.movieSchedules.map((schedule, schedIndex) => (
                <div key={`${schedule._id}-${schedIndex}`}>
                  <p>Show Time: {schedule.showTime}</p>
                  <p>
                    Show Date:{" "}
                    {new Date(schedule.showDate).toLocaleDateString()}
                  </p>
                  <button
                    className={styles.bookButton}
                    onClick={() => handleShowClick(schedule, screen._id)}
                  >
                    Select Seats & Book
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {showSeatModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Select Your Seats</h3>
            <SeatSelection
              seats={seats}
              selectedSeats={selectedSeats}
              toggleSeatSelection={toggleSeatSelection}
            />
            <button className={styles.paymentButton} onClick={handleBooking}>
              Proceed to Payment
            </button>
            <button
              className={styles.closeButton}
              onClick={() => setShowSeatModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
