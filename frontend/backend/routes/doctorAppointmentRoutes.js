import express from "express";

import {
getDoctorAppointments,
updateAppointmentStatus,
} from "../controllers/doctorAppointmentController.js";

import {
protect,
doctorOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
"/",
protect,
doctorOnly,
getDoctorAppointments
);

router.patch(
"/:id/status",
protect,
doctorOnly,
updateAppointmentStatus
);

export default router;
