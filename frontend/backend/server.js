import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import doctorAppointmentRoutes from "./routes/doctorAppointmentRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rekha Hospital API is running",
    port: process.env.PORT || 6000,
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/doctors", doctorRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/doctor-appointments", doctorAppointmentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      "Route not found: " +
      req.method +
      " " +
      req.originalUrl,
  });
});

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(
    "Rekha Hospital API running on http://localhost:" + PORT
  );
});