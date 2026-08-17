import User from "../models/User.js";
import Appointment from "../models/appointmentModel.js";

// ==========================================
// GET ALL DOCTORS
// PUBLIC
// ==========================================

export const getDoctors = async (
  req,
  res
) => {
  try {
    const doctors =
      await User.find({
        role: "doctor",
        isActive: true,
      }).select(
        "name email phone avatar role specialization"
      );

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error(
      "Get doctors error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch doctors",
    });
  }
};


// ==========================================
// GET DOCTOR BY ID
// PUBLIC
// ==========================================

export const getDoctorById = async (
  req,
  res
) => {
  try {
    const doctor =
      await User.findOne({
        _id: req.params.id,
        role: "doctor",
        isActive: true,
      }).select(
        "name email phone avatar role specialization"
      );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error(
      "Get doctor error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch doctor",
    });
  }
};


// ==========================================
// GET MY DOCTOR APPOINTMENTS
// DOCTOR ONLY
// ==========================================

export const getDoctorAppointments =
  async (req, res) => {
    try {
      const appointments =
        await Appointment.find({
          doctor: req.user._id,
        })
          .populate(
            "patient",
            "name email phone avatar"
          )
          .populate(
            "doctor",
            "name email phone avatar specialization"
          )
          .sort({
            appointmentDate: 1,
          });

      return res.status(200).json({
        success: true,
        count: appointments.length,
        appointments,
      });
    } catch (error) {
      console.error(
        "Get doctor appointments error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch doctor appointments",
      });
    }
  };


// ==========================================
// GET DOCTOR DASHBOARD STATS
// DOCTOR ONLY
// ==========================================

export const getDoctorStats =
  async (req, res) => {
    try {
      const doctorId =
        req.user._id;

      const [
        total,
        pending,
        confirmed,
        completed,
        cancelled,
        rejected,
      ] = await Promise.all([
        Appointment.countDocuments({
          doctor: doctorId,
        }),

        Appointment.countDocuments({
          doctor: doctorId,
          status: "pending",
        }),

        Appointment.countDocuments({
          doctor: doctorId,
          status: "confirmed",
        }),

        Appointment.countDocuments({
          doctor: doctorId,
          status: "completed",
        }),

        Appointment.countDocuments({
          doctor: doctorId,
          status: "cancelled",
        }),

        Appointment.countDocuments({
          doctor: doctorId,
          status: "rejected",
        }),
      ]);

      return res.status(200).json({
        success: true,

        stats: {
          total,
          pending,
          confirmed,
          completed,
          cancelled,
          rejected,
        },
      });
    } catch (error) {
      console.error(
        "Get doctor stats error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch doctor statistics",
      });
    }
  };


// ==========================================
// UPDATE APPOINTMENT STATUS
// DOCTOR ONLY
// ==========================================

export const updateAppointmentStatus =
  async (req, res) => {
    try {
      const {
        status,
      } = req.body;

      const allowedStatuses = [
        "confirmed",
        "rejected",
        "completed",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid appointment status",
        });
      }

      const appointment =
        await Appointment.findOne({
          _id: req.params.id,
          doctor: req.user._id,
        });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message:
            "Appointment not found",
        });
      }

      // ========================================
      // STATUS RULES
      // ========================================

      if (
        status === "confirmed" &&
        appointment.status !== "pending"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only pending appointments can be confirmed",
        });
      }

      if (
        status === "rejected" &&
        appointment.status !== "pending"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only pending appointments can be rejected",
        });
      }

      if (
        status === "completed" &&
        appointment.status !== "confirmed"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Only confirmed appointments can be completed",
        });
      }

      if (
        appointment.status === "cancelled"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Cancelled appointments cannot be updated",
        });
      }

      if (
        appointment.status === "rejected"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rejected appointments cannot be updated",
        });
      }

      if (
        appointment.status === "completed"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Completed appointments cannot be updated",
        });
      }

      appointment.status = status;

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
          `Appointment ${status} successfully`,
        appointment:
          updatedAppointment,
      });
    } catch (error) {
      console.error(
        "Update appointment status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update appointment status",
      });
    }
  };