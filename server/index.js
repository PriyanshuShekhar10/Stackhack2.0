const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 8000;
const cookieParser = require("cookie-parser");

const authRoutes = require("./Routes/Auth");
const adminRoutes = require("./Routes/Admin");
const movieRoutes = require("./Routes/Movie");

require("dotenv").config();
require("./db");

app.use(bodyParser.json());

app.use(
  cors({
    origin: [
      "https://stackhack2-0.vercel.app/",
      "https://stackhack2-0-hj88.vercel.app/",
      "http://localhost:5173/",
      "http://localhost:5174/",
    ],
    credentials: true, // Allow credentials
  })
);

app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/movie", movieRoutes);

app.get("/", (req, res) => {
  res.json({ message: "The API is working" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
