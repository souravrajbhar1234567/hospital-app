import Appointment from "../models/appointmentModel.js";

// ==========================================
// GET DOCTOR'S APPOINTMENTS
// ==========================================

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
    })
      .populate(
        "patient",
        "name email phone avatar"
      )
      .populate(
        "doctor",
        "name email phone avatar"
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
      message: "Unable to fetch doctor appointments",
    });
  }
};

// ==========================================
// UPDATE APPOINTMENT STATUS
// ==========================================

export const updateAppointmentStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "confirmed",
      "rejected",
      "completed",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Appointment status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
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
        message: "Appointment not found",
      });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message:
          "Cancelled appointments cannot be updated",
      });
    }

    if (appointment.status === "rejected") {
      return res.status(400).json({
        success: false,
        message:
          "Rejected appointments cannot be updated",
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
          "name email phone avatar"
        );

    return res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment: updatedAppointment,
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