import Appointment from "../models/appointmentModel.js";
import User from "../models/User.js";

// ==========================================
// CREATE APPOINTMENT
// PATIENT
// ==========================================

export const createAppointment =
  async (req, res) => {
    try {
      const {
        doctor,
        appointmentDate,
        reason,
      } = req.body;

      if (!doctor || !appointmentDate) {
        return res.status(400).json({
          success: false,
          message:
            "Doctor and appointment date are required",
        });
      }

      // ========================================
      // CHECK DATE
      // ========================================

      const date =
        new Date(appointmentDate);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a valid appointment date",
        });
      }

      // ========================================
      // CHECK DOCTOR
      // ========================================

      const doctorUser =
        await User.findOne({
          _id: doctor,
          role: "doctor",
          isActive: true,
        });

      if (!doctorUser) {
        return res.status(404).json({
          success: false,
          message:
            "Doctor not found or unavailable",
        });
      }

      // ========================================
      // CREATE APPOINTMENT
      // ========================================

      const appointment =
        await Appointment.create({
          patient: req.user._id,
          doctor,
          appointmentDate: date,
          reason: reason || "",
          status: "pending",
        });

      // ========================================
      // POPULATE
      // ========================================

      const populatedAppointment =
        await Appointment.findById(
          appointment._id
        )
          .populate(
            "patient",
            "name email phone avatar"
          )
          .populate(
            "doctor",
            "name email phone avatar specialization"
          );

      return res.status(201).json({
        success: true,
        message:
          "Appointment booked successfully",
        appointment:
          populatedAppointment,
      });
    } catch (error) {
      console.error(
        "Create appointment error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to create appointment",
      });
    }
  };


// ==========================================
// GET MY APPOINTMENTS
// PATIENT
// ==========================================

export const getMyAppointments =
  async (req, res) => {
    try {
      const appointments =
        await Appointment.find({
          patient: req.user._id,
        })
          .populate(
            "doctor",
            "name email phone avatar specialization"
          )
          .sort({
            appointmentDate: -1,
          });

      return res.status(200).json({
        success: true,
        count: appointments.length,
        appointments,
      });
    } catch (error) {
      console.error(
        "Get appointments error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch appointments",
      });
    }
  };


// ==========================================
// CANCEL APPOINTMENT
// PATIENT
// ==========================================

export const cancelAppointment =
  async (req, res) => {
    try {
      const appointment =
        await Appointment.findOne({
          _id: req.params.id,
          patient: req.user._id,
        });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message:
            "Appointment not found",
        });
      }

      // ========================================
      // ALREADY CANCELLED
      // ========================================

      if (
        appointment.status === "cancelled"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Appointment is already cancelled",
        });
      }

      // ========================================
      // COMPLETED
      // ========================================

      if (
        appointment.status === "completed"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Completed appointments cannot be cancelled",
        });
      }

      // ========================================
      // REJECTED
      // ========================================

      if (
        appointment.status === "rejected"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rejected appointments cannot be cancelled",
        });
      }

      // ========================================
      // CANCEL
      // ========================================

      appointment.status =
        "cancelled";

      await appointment.save();

      const updatedAppointment =
        await Appointment.findById(
          appointment._id
        )
          .populate(
            "patient",
            "name email phone avatar"
          )
          .populate(
            "doctor",
            "name email phone avatar specialization"
          );

      return res.status(200).json({
        success: true,
        message:
          "Appointment cancelled successfully",
        appointment:
          updatedAppointment,
      });
    } catch (error) {
      console.error(
        "Cancel appointment error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to cancel appointment",
      });
    }
  };