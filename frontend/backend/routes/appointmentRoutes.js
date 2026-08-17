import express from "express";

import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
} from "../controllers/appointmentController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// CREATE APPOINTMENT
// ==========================================

router.post(
  "/",
  protect,
  createAppointment
);


// ==========================================
// GET MY APPOINTMENTS
// ==========================================

router.get(
  "/my",
  protect,
  getMyAppointments
);


// ==========================================
// CANCEL APPOINTMENT
// ==========================================

router.patch(
  "/:id/cancel",
  protect,
  cancelAppointment
);


export default router;