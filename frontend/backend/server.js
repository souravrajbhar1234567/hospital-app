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

// ==========================================
// DATABASE
// ==========================================

connectDB();

// ==========================================
// SECURITY
// ==========================================

app.use(helmet());

// ==========================================
// CORS
// ==========================================

// Production frontend URLs
const allowedOrigins = [
  "https://hospital-app-hxzn.onrender.com",
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // ==========================================
      // Allow requests without Origin
      // Postman / Thunder Client / server requests
      // ==========================================

      if (!origin) {
        return callback(null, true);
      }

      // ==========================================
      // Allow production frontend
      // ==========================================

      if (allowedOrigins.includes(origin)) {
        console.log("✅ Production CORS allowed:", origin);
        return callback(null, true);
      }

      // ==========================================
      // Allow ANY localhost port
      // Examples:
      // http://localhost:5173
      // http://localhost:5177
      // http://localhost:5178
      // http://localhost:3000
      // ==========================================

      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        console.log("✅ Localhost CORS allowed:", origin);
        return callback(null, true);
      }

      // ==========================================
      // Block unknown origins
      // ==========================================

      console.log("❌ CORS blocked:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    // Cookies / authentication
    credentials: true,

    // HTTP methods
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    // Request headers
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
  })
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==========================================
// COOKIES
// ==========================================

app.use(cookieParser());

// ==========================================
// LOGGER
// ==========================================

app.use(morgan("dev"));

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rekha Hospital API is running",
    port: process.env.PORT || 6000,
  });
});

// ==========================================
// AUTH ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

// ==========================================
// DOCTOR ROUTES
// ==========================================

app.use("/api/doctors", doctorRoutes);

// ==========================================
// PATIENT APPOINTMENT ROUTES
// ==========================================

app.use("/api/appointments", appointmentRoutes);

// ==========================================
// DOCTOR APPOINTMENT ROUTES
// ==========================================

app.use(
  "/api/doctor-appointments",
  doctorAppointmentRoutes
);

// ==========================================
// UNKNOWN ROUTES
// ==========================================

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

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);

  // CORS error
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS origin not allowed",
    });
  }

  // Other errors
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(
    `🚀 Rekha Hospital API running on port ${PORT}`
  );
});