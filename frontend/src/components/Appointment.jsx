import { useEffect, useState } from "react";
import "../styles/appointment.css";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Appointment = () => {
  const { user, isAuthenticated } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  const [form, setForm] = useState({
    doctor: "",
    appointmentDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD DOCTORS
  // ==========================================

  const loadDoctors = async () => {
    try {
      setDoctorsLoading(true);

      const response = await api.get("/doctors");

      console.log(
        "Doctors for appointment:",
        response.data
      );

      setDoctors(response.data?.doctors || []);
    } catch (err) {
      console.error(
        "Doctor loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load doctors."
      );
    } finally {
      setDoctorsLoading(false);
    }
  };

  // ==========================================
  // LOAD DOCTORS WHEN COMPONENT OPENS
  // ==========================================

  useEffect(() => {
    loadDoctors();
  }, []);

  // ==========================================
  // UPDATE FORM
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // BOOK APPOINTMENT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // User must be logged in
    if (!isAuthenticated) {
      setError(
        "Please login before booking an appointment."
      );

      return;
    }

    // Validate doctor
    if (!form.doctor) {
      setError(
        "Please select a doctor."
      );

      return;
    }

    // Validate appointment date
    if (!form.appointmentDate) {
      setError(
        "Please select an appointment date and time."
      );

      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // SEND EXACT FIELDS EXPECTED BY BACKEND
      // ==========================================

      const response = await api.post(
        "/appointments",
        {
          doctor: form.doctor,
          appointmentDate:
            form.appointmentDate,
          reason: form.reason.trim(),
        }
      );

      console.log(
        "Appointment response:",
        response.data
      );

      if (response.data?.success) {
        setSuccess(
          response.data.message ||
            "Appointment booked successfully."
        );

        // Reset form
        setForm({
          doctor: "",
          appointmentDate: "",
          reason: "",
        });
      } else {
        setError(
          response.data?.message ||
            "Unable to book appointment."
        );
      }
    } catch (err) {
      console.error(
        "Appointment error:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Response:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Unable to book appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET MINIMUM DATE
  // ==========================================

  const getMinDateTime = () => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    const hours = String(
      now.getHours()
    ).padStart(2, "0");

    const minutes = String(
      now.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <section
      className="appointment"
      id="appointment"
    >
      <div className="appointment-container">

        {/* ==================================
            LEFT SIDE
        ================================== */}

        <div className="appointment-intro">

          <span className="appointment-eyebrow">
            YOUR HEALTH MATTERS
          </span>

          <h2>
            Book Your
            <span> Appointment</span>
          </h2>

          <p>
            Schedule a consultation with our
            experienced medical professionals
            and take the next step toward
            better health.
          </p>

          <div className="appointment-features">

            <div className="appointment-feature">
              <div className="feature-icon">
                ✓
              </div>

              <div>
                <h4>
                  Expert Doctors
                </h4>

                <p>
                  Experienced medical specialists.
                </p>
              </div>
            </div>

            <div className="appointment-feature">
              <div className="feature-icon">
                ✓
              </div>

              <div>
                <h4>
                  Easy Booking
                </h4>

                <p>
                  Book your appointment in minutes.
                </p>
              </div>
            </div>

            <div className="appointment-feature">
              <div className="feature-icon">
                ✓
              </div>

              <div>
                <h4>
                  Quality Care
                </h4>

                <p>
                  Compassionate patient-focused care.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ==================================
            APPOINTMENT CARD
        ================================== */}

        <div className="appointment-card">

          <div className="appointment-card-header">

            <h3>
              Schedule an Appointment
            </h3>

            <p>
              Choose your doctor and preferred
              appointment time.
            </p>

          </div>

          {/* LOGIN MESSAGE */}

          {!isAuthenticated && (
            <div className="appointment-login-message">
              Please login before booking an
              appointment.
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="appointment-success">
              ✓ {success}
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="appointment-error">
              {error}
            </div>
          )}

          <form
            className="appointment-form"
            onSubmit={handleSubmit}
          >

            {/* ==================================
                PATIENT NAME
            ================================== */}

            <div className="appointment-field">

              <label>
                Patient Name
              </label>

              <input
                type="text"
                value={
                  user?.name || ""
                }
                placeholder="Login to see your name"
                disabled
              />

            </div>

            {/* ==================================
                DOCTOR
            ================================== */}

            <div className="appointment-field">

              <label htmlFor="doctor">
                Select Doctor
              </label>

              <select
                id="doctor"
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                disabled={
                  doctorsLoading ||
                  loading ||
                  !isAuthenticated
                }
              >

                <option value="">
                  {doctorsLoading
                    ? "Loading doctors..."
                    : "Select a doctor"}
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor._id}
                    value={doctor._id}
                  >
                    {doctor.name}
                  </option>
                ))}

              </select>

            </div>

            {/* ==================================
                APPOINTMENT DATE
            ================================== */}

            <div className="appointment-field">

              <label htmlFor="appointmentDate">
                Appointment Date & Time
              </label>

              <input
                id="appointmentDate"
                type="datetime-local"
                name="appointmentDate"
                value={
                  form.appointmentDate
                }
                min={getMinDateTime()}
                onChange={handleChange}
                disabled={
                  loading ||
                  !isAuthenticated
                }
              />

            </div>

            {/* ==================================
                REASON
            ================================== */}

            <div className="appointment-field">

              <label htmlFor="reason">
                Reason for Visit
                <span>
                  {" "}
                  (Optional)
                </span>
              </label>

              <textarea
                id="reason"
                name="reason"
                rows="4"
                placeholder="Tell us briefly why you need an appointment..."
                value={form.reason}
                onChange={handleChange}
                disabled={
                  loading ||
                  !isAuthenticated
                }
              />

            </div>

            {/* ==================================
                SUBMIT
            ================================== */}

            <button
              type="submit"
              className="appointment-submit"
              disabled={
                loading ||
                !isAuthenticated ||
                doctorsLoading ||
                doctors.length === 0
              }
            >

              {loading
                ? "Booking Appointment..."
                : "Book Appointment"}

              {!loading && (
                <span>
                  →
                </span>
              )}

            </button>

          </form>

        </div>

      </div>
    </section>
  );
};

export default Appointment;