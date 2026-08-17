import express from "express";

import {
  getDoctors,
  getDoctorById,
} from "../controllers/doctorController.js";

const router = express.Router();

// ==========================================
// PUBLIC DOCTOR ROUTES
// ==========================================

// Get all active doctors
router.get(
  "/",
  getDoctors
);

// Get single doctor
router.get(
  "/:id",
  getDoctorById
);

export default router;