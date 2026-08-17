import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC AUTH ROUTES
// ==========================================

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

// ==========================================
// PROTECTED AUTH ROUTES
// ==========================================

router.get("/me", protect, getCurrentUser);

export default router;