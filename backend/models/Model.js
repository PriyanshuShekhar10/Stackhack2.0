import mongoose from "mongoose";


const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    language: { type: String, required: true },
    genre: { type: String, required: true },
    director: { type: String, required: true },
    trailer: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  });

  

  const theatreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    seats: { type: Number, required: true },
    image: { type: String, required: true }
  });

  
  const showtimeSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    ticketPrice: { type: Number, required: true }
  });

  

  const reservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    seats: [{ type: String, required: true }], // Array of seat identifiers like "A1", "A2", etc.
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'booked', enum: ['booked', 'cancelled'] } // To manage reservation status
  });
  


  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Customer', 'SuperAdmin'], default: 'Customer' },
    phone: { type: String, required: true }
  });
  