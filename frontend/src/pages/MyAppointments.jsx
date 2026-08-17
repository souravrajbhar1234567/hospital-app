import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

import "../styles/myAppointments.css";

const MyAppointments = () => {
  const { isAuthenticated } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // ==========================================
  // LOAD MY APPOINTMENTS
  // ==========================================

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments/my");

      console.log("My appointments:", response.data);

      if (response.data?.success) {
        setAppointments(response.data.appointments || []);
      } else {
        setError(
          response.data?.message ||
            "Unable to load appointments."
        );
      }
    } catch (err) {
      console.error("My appointments error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD WHEN USER IS AUTHENTICATED
  // ==========================================

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    } else {
      setAppointments([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // CANCEL APPOINTMENT
  // ==========================================

  const handleCancel = async (appointmentId) => {
    if (!appointmentId) {
      setError("Invalid appointment.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(appointmentId);
      setError("");

      const response = await api.patch(
        `/appointments/${appointmentId}/cancel`
      );

      console.log("Cancel appointment:", response.data);

      if (response.data?.success) {
        setAppointments((previousAppointments) =>
          previousAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? {
                  ...appointment,
                  status: "cancelled",
                }
              : appointment
          )
        );
      } else {
        setError(
          response.data?.message ||
            "Unable to cancel appointment."
        );
      }
    } catch (err) {
      console.error("Cancel appointment error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to cancel appointment."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!isAuthenticated && !loading) {
    return (
      <section className="my-appointments">
        <div className="my-appointments-login">
          <div className="my-appointments-login-icon">
            +
          </div>

          <h2>Login Required</h2>

          <p>
            Please login to view your appointments.
          </p>

          <Link
            to="/login"
            className="my-appointments-login-button"
          >
            Login
          </Link>
        </div>
      </section>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <section className="my-appointments">
      <div className="my-appointments-container">

        {/* HEADER */}

        <div className="my-appointments-header">
          <div>
            <span className="my-appointments-eyebrow">
              PATIENT DASHBOARD
            </span>

            <h1>
              My
              <span> Appointments</span>
            </h1>

            <p>
              View and manage your upcoming and
              previous appointments.
            </p>
          </div>

          <Link
            to="/"
            className="book-new-button"
          >
            Book New Appointment
            <span>→</span>
          </Link>
        </div>

        {/* ERROR */}

        {error && (
          <div className="my-appointments-error">
            <span>{error}</span>

            <button
              type="button"
              onClick={loadAppointments}
            >
              Try Again
            </button>
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="my-appointments-loading">
            <div className="appointments-spinner"></div>

            <p>
              Loading your appointments...
            </p>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          appointments.length === 0 && (
            <div className="appointments-empty">
              <div className="appointments-empty-icon">
                +
              </div>

              <h2>
                No Appointments Yet
              </h2>

              <p>
                You haven't booked an appointment yet.
                Start by choosing one of our specialists.
              </p>

              <Link
                to="/"
                className="appointments-empty-button"
              >
                Book an Appointment
                <span>→</span>
              </Link>
            </div>
          )}

        {/* APPOINTMENTS */}

        {!loading && appointments.length > 0 && (
          <div className="appointments-list">
            {appointments.map((appointment) => {
              const isCancelled =
                appointment.status === "cancelled";

              const isCompleted =
                appointment.status === "completed";

              return (
                <article
                  key={appointment._id}
                  className="appointment-history-card"
                >

                  {/* TOP */}

                  <div className="appointment-history-top">

                    <div className="appointment-doctor">

                      <div className="appointment-doctor-avatar">
                        {appointment.doctor?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "D"}
                      </div>

                      <div>
                        <span>DOCTOR</span>

                        <h2>
                          {appointment.doctor?.name ||
                            "Doctor"}
                        </h2>

                        <p>
                          Medical Specialist
                        </p>
                      </div>

                    </div>

                    <span
                      className={`appointment-status status-${appointment.status}`}
                    >
                      {appointment.status}
                    </span>

                  </div>

                  {/* DETAILS */}

                  <div className="appointment-details">

                    <div className="appointment-detail">

                      <span className="detail-icon">
                        ◷
                      </span>

                      <div>
                        <small>DATE</small>

                        <strong>
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </strong>
                      </div>

                    </div>

                    <div className="appointment-detail">

                      <span className="detail-icon">
                        ◴
                      </span>

                      <div>
                        <small>TIME</small>

                        <strong>
                          {formatTime(
                            appointment.appointmentDate
                          )}
                        </strong>
                      </div>

                    </div>

                    <div className="appointment-detail">

                      <span className="detail-icon">
                        #
                      </span>

                      <div>
                        <small>BOOKING ID</small>

                        <strong>
                          {appointment._id
                            ?.slice(-8)
                            ?.toUpperCase() || "N/A"}
                        </strong>
                      </div>

                    </div>

                  </div>

                  {/* REASON */}

                  {appointment.reason && (
                    <div className="appointment-reason">

                      <small>
                        REASON FOR VISIT
                      </small>

                      <p>
                        {appointment.reason}
                      </p>

                    </div>
                  )}

                  {/* CANCEL */}

                  {!isCancelled &&
                    !isCompleted && (
                      <div className="appointment-history-actions">

                        <button
                          type="button"
                          className="cancel-appointment-button"
                          disabled={
                            cancellingId ===
                            appointment._id
                          }
                          onClick={() =>
                            handleCancel(
                              appointment._id
                            )
                          }
                        >
                          {cancellingId ===
                          appointment._id
                            ? "Cancelling..."
                            : "Cancel Appointment"}
                        </button>

                      </div>
                    )}

                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default MyAppointments;