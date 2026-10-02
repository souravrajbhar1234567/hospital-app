import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/appointment.css";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { DEFAULT_DOCTORS } from "../services/aiService.js";

import d1 from "../assets/doctor1.jpeg";
import d2 from "../assets/doctor2.jpeg";
import d3 from "../assets/doctor3.jpeg";

const doctorAvatars = {
  "Dr. Rahul Sharma": d1,
  "Dr. Priya Mehta": d2,
  "Dr. Arjun Patel": d3,
};

const Appointment = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Initialize with verified default doctors so it's instantly bookable
  const [doctors, setDoctors] = useState(DEFAULT_DOCTORS);
  const [doctorsLoading, setDoctorsLoading] = useState(false);

  const [form, setForm] = useState({
    doctor: "6a83ba1184618eff8d44b18d", // Default to Dr. Priya Mehta
    appointmentDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selectedNotice, setSelectedNotice] = useState("");

  // ==========================================
  // LOAD DOCTORS FROM API
  // ==========================================

  const loadDoctors = async () => {
    try {
      setDoctorsLoading(true);

      const response = await api.get("/doctors");

      console.log("Doctors for appointment:", response.data);

      if (response.data?.success && response.data.doctors?.length > 0) {
        setDoctors(response.data.doctors);
      }
    } catch (err) {
      console.warn("Using default doctors list:", err.message);
    } finally {
      setDoctorsLoading(false);
    }
  };

  // ==========================================
  // LOAD DOCTORS & RESTORE DRAFT ON MOUNT
  // ==========================================

  useEffect(() => {
    loadDoctors();

    // Check saved draft in sessionStorage
    try {
      const savedDraft = sessionStorage.getItem("pending_appointment");
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.doctor) {
          setForm((prev) => ({
            ...prev,
            doctor: parsed.doctor,
            appointmentDate: parsed.appointmentDate || prev.appointmentDate,
            reason: parsed.reason || prev.reason,
          }));
          sessionStorage.removeItem("pending_appointment");
          setSelectedNotice("✓ Restored your selected appointment details!");
          setTimeout(() => setSelectedNotice(""), 5000);
        }
      }
    } catch (e) {
      console.warn("Could not parse draft:", e);
    }

    // Check URL parameters for ?doctor=...
    try {
      const params = new URLSearchParams(window.location.search);
      const doctorParam = params.get("doctor");
      if (doctorParam) {
        setForm((prev) => ({ ...prev, doctor: doctorParam }));
      }
    } catch (e) {
      console.warn("URL param check failed:", e);
    }
  }, []);

  // ==========================================
  // LISTEN TO GLOBAL SELECT-DOCTOR EVENTS
  // ==========================================

  useEffect(() => {
    const handleSelectDoctor = (event) => {
      const { doctorId, doctorName, specialization, reason } =
        event.detail || {};

      if (doctorId) {
        setForm((prev) => ({
          ...prev,
          doctor: doctorId,
          reason: reason || prev.reason,
        }));

        setSelectedNotice(
          `✓ Selected ${doctorName || "Doctor"} (${specialization || "Specialist"}) for your appointment!`
        );

        setTimeout(() => setSelectedNotice(""), 6000);
      }
    };

    window.addEventListener("select-doctor", handleSelectDoctor);
    return () => window.removeEventListener("select-doctor", handleSelectDoctor);
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

  // Direct card click selector
  const handleSelectDoctorCard = (docId) => {
    setForm((prev) => ({ ...prev, doctor: docId }));
    setError("");
    const matched = doctors.find((d) => d._id === docId);
    if (matched) {
      setSelectedNotice(`✓ Selected ${matched.name} (${matched.specialization})`);
      setTimeout(() => setSelectedNotice(""), 4000);
    }
  };

  // ==========================================
  // BOOK APPOINTMENT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Validate doctor
    if (!form.doctor) {
      setError("Please select Dr. Priya Mehta, Dr. Arjun Patel, or Dr. Rahul Sharma.");
      return;
    }

    // Validate appointment date
    if (!form.appointmentDate) {
      setError("Please select an appointment date and time.");
      return;
    }

    // If user is not logged in, save draft and prompt to login
    if (!isAuthenticated) {
      sessionStorage.setItem("pending_appointment", JSON.stringify(form));
      setError(
        "Please sign in or create an account to confirm your appointment. Your doctor selection has been saved!"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/appointments", {
        doctor: form.doctor,
        appointmentDate: form.appointmentDate,
        reason: form.reason.trim(),
      });

      console.log("Appointment response:", response.data);

      if (response.data?.success) {
        const bookedDocName =
          response.data.appointment?.doctor?.name || "your doctor";

        setSuccess(
          `✓ Appointment with ${bookedDocName} booked successfully! View it in My Appointments.`
        );

        // Reset form
        setForm({
          doctor: form.doctor, // Keep chosen doctor
          appointmentDate: "",
          reason: "",
        });
      } else {
        setError(
          response.data?.message || "Unable to book appointment."
        );
      }
    } catch (err) {
      console.error("Appointment error:", err);

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
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Currently selected doctor object
  const currentSelectedDoctor =
    doctors.find((d) => d._id === form.doctor) || doctors[0];

  const getDoctorImage = (doc) => {
    if (doctorAvatars[doc?.name]) return doctorAvatars[doc.name];
    if (doc?.avatar) return doc.avatar;
    if (doc?.name?.includes("Priya")) return d2;
    if (doc?.name?.includes("Arjun")) return d3;
    return d1;
  };

  return (
    <section className="appointment" id="appointment">
      <div className="appointment-container">
        {/* ==================================
            LEFT SIDE INTRO
        ================================== */}
        <div className="appointment-intro">
          <span className="appointment-eyebrow">YOUR HEALTH MATTERS</span>

          <h2>
            Book Your
            <span> Appointment</span>
          </h2>

          <p>
            Schedule a consultation with our experienced medical professionals. Choose between
            <strong> Dr. Priya Mehta (Cardiology)</strong>,
            <strong> Dr. Arjun Patel (Dermatology)</strong>, or
            <strong> Dr. Rahul Sharma (General Medicine)</strong>.
          </p>

          <div className="appointment-features">
            <div className="appointment-feature">
              <div className="feature-icon">✓</div>
              <div>
                <h4>Expert Specialists</h4>
                <p>Cardiology, Dermatology & General Healthcare.</p>
              </div>
            </div>

            <div className="appointment-feature">
              <div className="feature-icon">✓</div>
              <div>
                <h4>Easy Instant Booking</h4>
                <p>Select your specialist & preferred slot in seconds.</p>
              </div>
            </div>

            <div className="appointment-feature">
              <div className="feature-icon">✓</div>
              <div>
                <h4>24/7 AI Triage Support</h4>
                <p>Not sure? Use our AI Health Assistant anytime.</p>
              </div>
            </div>
          </div>

          {/* QUICK PROMPT TO LAUNCH AI ASSISTANT */}
          <div className="appointment-ai-box">
            <div className="appointment-ai-icon">🤖</div>
            <div className="appointment-ai-text">
              <strong>Need help deciding?</strong>
              <p>Ask our AI Health Assistant to evaluate your symptoms.</p>
            </div>
            <button
              type="button"
              className="appointment-ai-btn"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-ai-assistant"))
              }
            >
              Ask AI
            </button>
          </div>
        </div>

        {/* ==================================
            APPOINTMENT FORM CARD
        ================================== */}
        <div className="appointment-card">
          <div className="appointment-card-header">
            <h3>Schedule an Appointment</h3>
            <p>Select your doctor and preferred consultation slot.</p>
          </div>

          {/* DOCTOR SELECTION NOTICE */}
          {selectedNotice && (
            <div className="appointment-selection-notice">
              {selectedNotice}
            </div>
          )}

          {/* LOGIN MESSAGE IF NOT AUTHENTICATED */}
          {!isAuthenticated && (
            <div className="appointment-login-banner">
              <div>
                <strong>Sign in to complete your booking</strong>
                <p>You can choose your doctor below; we will save your draft.</p>
              </div>
              <div className="banner-links">
                <Link to="/login" className="banner-login-btn">
                  Sign In
                </Link>
                <Link to="/register" className="banner-reg-btn">
                  Register
                </Link>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="appointment-success">
              {success}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="appointment-error">
              {error}
              {!isAuthenticated && (
                <div style={{ marginTop: "8px" }}>
                  <Link to="/login" className="error-login-link">
                    Click here to Login & Confirm →
                  </Link>
                </div>
              )}
            </div>
          )}

          <form className="appointment-form" onSubmit={handleSubmit}>
            {/* ==================================
                PATIENT NAME
            ================================== */}
            <div className="appointment-field">
              <label>Patient Name</label>
              <input
                type="text"
                value={user?.name || ""}
                placeholder={
                  isAuthenticated
                    ? user?.name
                    : "Sign in to attach your patient profile"
                }
                disabled
              />
            </div>

            {/* ==================================
                INTERACTIVE DOCTOR SELECTOR CARDS
            ================================== */}
            <div className="appointment-field">
              <div className="field-label-row">
                <label>
                  Choose Your Specialist <span className="req">*</span>
                </label>
                <span className="field-hint">Click card to select</span>
              </div>

              {/* 3 Clickable Doctor Selection Cards */}
              <div className="doctor-select-grid">
                {doctors.map((doc) => {
                  const isSelected = form.doctor === doc._id;
                  const isCardio =
                    doc.specialization?.toLowerCase().includes("cardio") ||
                    doc.name?.includes("Priya");
                  const isDerma =
                    doc.specialization?.toLowerCase().includes("dermat") ||
                    doc.name?.includes("Arjun");

                  return (
                    <div
                      key={doc._id}
                      className={`doctor-select-card ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelectDoctorCard(doc._id)}
                    >
                      <div className="doc-select-header">
                        <img
                          src={getDoctorImage(doc)}
                          alt={doc.name}
                          className="doc-select-avatar"
                        />
                        <div className="doc-select-info">
                          <span
                            className={`doc-badge ${
                              isCardio
                                ? "cardio"
                                : isDerma
                                ? "derma"
                                : "general"
                            }`}
                          >
                            {isCardio
                              ? "❤️ Heart"
                              : isDerma
                              ? "🌿 Skin"
                              : "🩺 General"}
                          </span>
                          <h4>{doc.name}</h4>
                          <span className="doc-spec">
                            {doc.specialization}
                          </span>
                        </div>
                      </div>

                      <div className="doc-select-footer">
                        <span className="doc-avail-dot">● Available</span>
                        <span className="doc-radio-check">
                          {isSelected ? "✓ Selected" : "Select"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dropdown in Sync */}
              <div className="dropdown-sync-wrap">
                <label htmlFor="doctor" className="sublabel">
                  Or select from dropdown:
                </label>
                <select
                  id="doctor"
                  name="doctor"
                  value={form.doctor}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} — {doctor.specialization || "Specialist"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CURRENTLY SELECTED SUMMARY BADGE */}
            {currentSelectedDoctor && (
              <div className="selected-doctor-summary">
                <div className="summary-avatar-wrap">
                  <img
                    src={getDoctorImage(currentSelectedDoctor)}
                    alt={currentSelectedDoctor.name}
                  />
                </div>
                <div className="summary-details">
                  <small>BOOKING CONSULTATION WITH</small>
                  <strong>{currentSelectedDoctor.name}</strong>
                  <span>{currentSelectedDoctor.specialization}</span>
                </div>
                <span className="summary-status-pill">Ready to Schedule</span>
              </div>
            )}

            {/* ==================================
                APPOINTMENT DATE & TIME
            ================================== */}
            <div className="appointment-field">
              <label htmlFor="appointmentDate">
                Appointment Date & Time <span className="req">*</span>
              </label>

              <input
                id="appointmentDate"
                type="datetime-local"
                name="appointmentDate"
                value={form.appointmentDate}
                min={getMinDateTime()}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            {/* ==================================
                REASON FOR VISIT
            ================================== */}
            <div className="appointment-field">
              <label htmlFor="reason">
                Reason for Visit <span>(Optional)</span>
              </label>

              <textarea
                id="reason"
                name="reason"
                rows="3"
                placeholder="Briefly describe your symptoms or reason for consulting the doctor..."
                value={form.reason}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* ==================================
                SUBMIT BUTTON
            ================================== */}
            <button
              type="submit"
              className="appointment-submit"
              disabled={loading || !form.doctor}
            >
              {loading
                ? "Confirming Appointment..."
                : currentSelectedDoctor
                ? `Confirm Appointment with ${currentSelectedDoctor.name}`
                : "Book Appointment"}
              {!loading && <span>→</span>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Appointment;