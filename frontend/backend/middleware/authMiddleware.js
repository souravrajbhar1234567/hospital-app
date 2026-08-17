import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ==========================================
// PROTECT
// ==========================================

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication",
    });
  }
};

// ==========================================
// DOCTOR ONLY
// ==========================================

export const doctorOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (req.user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Doctor access required",
      });
    }

    next();
  } catch (error) {
    console.error(
      "Doctor authorization error:",
      error.message
    );

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
};

// ==========================================
// ADMIN ONLY
// ==========================================

export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error(
      "Admin authorization error:",
      error.message
    );

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
};