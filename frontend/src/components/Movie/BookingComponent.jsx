import { useState, useEffect } from "react";
import styles from "./BookingComponent.module.css";

function SeatSelection({
  totalRows,
  totalCols,
  unavailableSeats,
  selectedSeats,
  toggleSeatSelection,
}) {
  const generateSeatGrid = () => {
    const seatGrid = [];
    for (let row = 0; row < totalRows; row++) {
      const rowSeats = [];
      for (let col = 0; col < totalCols; col++) {
        const seatId = `R${row + 1}C${col + 1}`;
        const isBooked = unavailableSeats.some(
          (seat) => seat.row === row && seat.col === col
        );
        console.log(`Seat ${seatId} booked status: ${isBooked}`);
        rowSeats.push({
          seat_id: seatId,
          row,
          col,
          isBooked,
        });
      }
      seatGrid.push(rowSeats);
    }
    return seatGrid;
  };

  const seatGrid = generateSeatGrid();

  return (
    <div className={styles.seatGrid}>
      {seatGrid.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.seatRow}>
          {row.map((seat, colIndex) => (
            <div
              key={`${seat.seat_id}-${rowIndex}-${colIndex}`}
              className={`${styles.seat} ${
                seat.isBooked ? styles.bookedSeat : ""
              } ${
                selectedSeats.some(
                  (s) => s.row === seat.row && s.col === seat.col
                )
                  ? styles.selectedSeat
                  : ""
              }`}
              onClick={() => !seat.isBooked && toggleSeatSelection(seat)}
            >
              {seat.seat_id}
            </div>
          ))}
        </div>
      ))}
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
  const [unavailableSeats, setUnavailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showSeatModal, setShowSeatModal] = useState(false);

  const totalRows = 10; // Total number of rows
  const totalCols = 10; // Total number of columns

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
    setScreens([]); // Clear screens when a new date is selected
  };

  useEffect(() => {
    const fetchScreens = async () => {
      if (movieId && selectedDate && city) {
        setLoading(true);
        setScreens([]); // Clear previous screens before fetching new ones
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_API
            }/movie/screensbymovieschedule/${city}/${selectedDate}/${movieId}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          const data = await response.json();
          if (data.ok && data.data.length > 0) {
            setScreens(data.data);
          } else {
            setScreens([]); // If no screens available, set empty array
            console.error("No screens available for the selected date.");
          }
        } catch (error) {
          console.error("Error fetching screens:", error);
          setScreens([]); // Set empty array on error
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
    setSelectedShow({ ...show, screenId });
    fetchUnavailableSeats(screenId, show.showDate);
  };

  const fetchUnavailableSeats = async (screenId, showDate) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API
        }/movie/schedulebymovie/${screenId}/${showDate}/${movieId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.ok) {
        const movieSchedule = data.data?.movieSchedule;
        setUnavailableSeats(movieSchedule?.notAvailableSeats || []);
        setShowSeatModal(true);
      } else {
        console.error("Failed to fetch unavailable seats.");
      }
    } catch (error) {
      console.error("Error fetching unavailable seats:", error);
    }
  };

  const toggleSeatSelection = (seat) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.some((s) => s.row === seat.row && s.col === seat.col)
        ? prevSelected.filter(
            (s) => !(s.row === seat.row && s.col === seat.col)
          )
        : [...prevSelected, seat]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length > 0) {
      const pricePerSeat = 100; // Set the actual price per seat
      const totalPrice = selectedSeats.length * pricePerSeat;

      selectedSeats.forEach((seat) => {
        seat.price = pricePerSeat;
      });

      const bookingDetails = {
        showTime: selectedShow.showTime,
        showDate: selectedShow.showDate,
        movieId: selectedShow.movieId,
        screenId: selectedShow.screenId,
        seats: selectedSeats,
        totalPrice,
        paymentId: "FAKE_PAYMENT_ID", // Replace with the actual payment ID after payment processing
        paymentType: "Credit Card", // Or the actual payment type
      };

      try {
        const authToken = localStorage.getItem("authToken"); // or sessionStorage

        const response = await fetch(
          `${import.meta.env.VITE_API}/movie/bookticket`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
            },
            credentials: "include",
            body: JSON.stringify(bookingDetails),
          }
        );

        const data = await response.json();
        if (data.ok) {
          alert("Booking successful!");
          setShowSeatModal(false);
          setSelectedSeats([]);
        } else {
          alert("Booking failed: " + data.message);
        }
      } catch (error) {
        console.error("Error during booking:", error);
        alert(
          "An error occurred while processing your booking. Please try again."
        );
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
              key={`${date}-${index}`}
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
              {screen.movieSchedules
                .filter(
                  (schedule) =>
                    new Date(schedule.showDate).toISOString().split("T")[0] ===
                    selectedDate
                )
                .map((schedule, schedIndex) => (
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
              totalRows={totalRows}
              totalCols={totalCols}
              unavailableSeats={unavailableSeats}
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
