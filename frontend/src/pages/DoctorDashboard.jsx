import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

import "../styles/doctorDashboard.css";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const {
    user,
    loading: authLoading,
    isAuthenticated,
  } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (
      !authLoading &&
      isAuthenticated &&
      user &&
      user.role !== "doctor"
    ) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/doctor-appointments");

      console.log("DOCTOR APPOINTMENTS RESPONSE:", response.data);

      if (response.data?.success) {
        setAppointments(response.data.appointments || []);
      } else {
        setError(
          response.data?.message ||
            "Unable to load appointments."
        );
      }
    } catch (err) {
      console.error("Doctor appointments error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      !authLoading &&
      isAuthenticated &&
      user?.role === "doctor"
    ) {
      loadAppointments();
    }
  }, [
    authLoading,
    isAuthenticated,
    user?.role,
  ]);

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed";

      case "completed":
        return "status-completed";

      case "cancelled":
        return "status-cancelled";

      case "rejected":
        return "status-rejected";

      default:
        return "status-pending";
    }
  };

  const filteredAppointments = useMemo(() => {
    if (filter === "all") {
      return appointments;
    }

    return appointments.filter(
      (appointment) =>
        appointment.status === filter
    );
  }, [appointments, filter]);

  const stats = useMemo(() => {
    return {
      total: appointments.length,

      pending: appointments.filter(
        (item) => item.status === "pending"
      ).length,

      confirmed: appointments.filter(
        (item) => item.status === "confirmed"
      ).length,

      completed: appointments.filter(
        (item) => item.status === "completed"
      ).length,
    };
  }, [appointments]);

  const handleStatusUpdate = async (
    appointmentId,
    status
  ) => {
    try {
      setActionLoading(
        `${appointmentId}-${status}`
      );

      const response = await api.patch(
        `/doctor-appointments/${appointmentId}/status`,
        {
          status: status,
        }
      );

      console.log(
        "STATUS UPDATE RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setAppointments((previous) =>
          previous.map((appointment) =>
            appointment._id === appointmentId
              ? response.data.appointment
              : appointment
          )
        );
      } else {
        alert(
          response.data?.message ||
            "Unable to update appointment."
        );
      }
    } catch (err) {
      console.error(
        "Appointment status update error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to update appointment."
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (
    authLoading ||
    (loading && appointments.length === 0)
  ) {
    return (
      <div className="doctor-dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>

          <h3>Loading Doctor Dashboard</h3>

          <p>
            Preparing your appointments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-page">

      <div className="dashboard-orb dashboard-orb-one"></div>

      <div className="dashboard-orb dashboard-orb-two"></div>

      <div className="dashboard-container">

        <motion.div
          className="dashboard-header"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div>
            <div className="dashboard-eyebrow">
              <span></span>
              DOCTOR PORTAL
            </div>

            <h1>
              Welcome back,{" "}
              <strong>
                Dr. {user?.name || "Doctor"}
              </strong>
            </h1>

            <p>
              Manage your appointments and
              provide excellent patient care.
            </p>
          </div>

          <div className="doctor-profile-mini">
            <div className="doctor-profile-avatar">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "D"}
            </div>

            <div>
              <strong>
                Dr. {user?.name || "Doctor"}
              </strong>

              <span>
                {user?.email || ""}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="dashboard-stats">

          <div className="stat-card">
            <div className="stat-icon">
              📅
            </div>

            <div>
              <span>Total Appointments</span>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              ⏳
            </div>

            <div>
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon confirmed">
              ✓
            </div>

            <div>
              <span>Confirmed</span>
              <strong>{stats.confirmed}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              ✦
            </div>

            <div>
              <span>Completed</span>
              <strong>{stats.completed}</strong>
            </div>
          </div>

        </div>

        <section className="appointments-section">

          <div className="appointments-heading">

            <div>
              <span className="section-label">
                APPOINTMENT MANAGEMENT
              </span>

              <h2>
                Patient Appointments
              </h2>
            </div>

            <button
              type="button"
              className="refresh-button"
              onClick={loadAppointments}
              disabled={loading}
            >
              {loading
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>

          </div>

          <div className="appointment-filters">

            {[
              ["all", "All"],
              ["pending", "Pending"],
              ["confirmed", "Confirmed"],
              ["completed", "Completed"],
              ["rejected", "Rejected"],
              ["cancelled", "Cancelled"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={
                  filter === value
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setFilter(value)
                }
              >
                {label}
              </button>
            ))}

          </div>

          {error && (
            <div className="dashboard-error">
              <span>!</span>

              <div>
                <strong>
                  Unable to load appointments
                </strong>

                <p>{error}</p>
              </div>

              <button
                type="button"
                onClick={loadAppointments}
              >
                Try Again
              </button>
            </div>
          )}

          {!error &&
            filteredAppointments.length === 0 && (
              <div className="appointments-empty">

                <div className="empty-calendar">
                  📅
                </div>

                <h3>
                  No appointments found
                </h3>

                <p>
                  There are no appointments
                  matching this filter.
                </p>

              </div>
            )}

          {!error &&
            filteredAppointments.length > 0 && (
              <div className="appointment-list">

                {filteredAppointments.map(
                  (appointment, index) => {

                    const patient =
                      appointment.patient || {};

                    const appointmentId =
                      appointment._id;

                    const status =
                      appointment.status ||
                      "pending";

                    return (
                      <motion.article
                        className="appointment-card"
                        key={appointmentId}
                        initial={{
                          opacity: 0,
                          y: 25,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: index * 0.06,
                        }}
                      >

                        <div className="appointment-card-top">

                          <div className="patient-info">

                            <div className="patient-avatar">
                              {patient.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "P"}
                            </div>

                            <div>
                              <span>
                                PATIENT
                              </span>

                              <h3>
                                {patient.name ||
                                  "Unknown Patient"}
                              </h3>
                            </div>

                          </div>

                          <span
                            className={`appointment-status ${getStatusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>

                        </div>

                        <div className="appointment-details">

                          <div className="appointment-detail">

                            <span className="detail-symbol">
                              📅
                            </span>

                            <div>
                              <small>
                                DATE
                              </small>

                              <strong>
                                {formatDate(
                                  appointment.appointmentDate
                                )}
                              </strong>
                            </div>

                          </div>

                          <div className="appointment-detail">

                            <span className="detail-symbol">
                              🕐
                            </span>

                            <div>
                              <small>
                                TIME
                              </small>

                              <strong>
                                {formatTime(
                                  appointment.appointmentDate
                                )}
                              </strong>
                            </div>

                          </div>

                          {patient.email && (
                            <div className="appointment-detail">

                              <span className="detail-symbol">
                                @
                              </span>

                              <div>
                                <small>
                                  EMAIL
                                </small>

                                <strong>
                                  {patient.email}
                                </strong>
                              </div>

                            </div>
                          )}

                          {patient.phone && (
                            <div className="appointment-detail">

                              <span className="detail-symbol">
                                ☎
                              </span>

                              <div>
                                <small>
                                  PHONE
                                </small>

                                <strong>
                                  {patient.phone}
                                </strong>
                              </div>

                            </div>
                          )}

                        </div>

                        {appointment.reason && (
                          <div className="appointment-reason">

                            <span>
                              Reason
                            </span>

                            <p>
                              {appointment.reason}
                            </p>

                          </div>
                        )}

                        <div className="appointment-actions">

                          {status === "pending" && (
                            <>
                              <button
                                type="button"
                                className="action-button confirm"
                                disabled={
                                  actionLoading !== null
                                }
                                onClick={() =>
                                  handleStatusUpdate(
                                    appointmentId,
                                    "confirmed"
                                  )
                                }
                              >
                                {actionLoading ===
                                `${appointmentId}-confirmed`
                                  ? "Confirming..."
                                  : "✓ Confirm"}
                              </button>

                              <button
                                type="button"
                                className="action-button reject"
                                disabled={
                                  actionLoading !== null
                                }
                                onClick={() =>
                                  handleStatusUpdate(
                                    appointmentId,
                                    "rejected"
                                  )
                                }
                              >
                                {actionLoading ===
                                `${appointmentId}-rejected`
                                  ? "Rejecting..."
                                  : "✕ Reject"}
                              </button>
                            </>
                          )}

                          {status === "confirmed" && (
                            <button
                              type="button"
                              className="action-button complete"
                              disabled={
                                actionLoading !== null
                              }
                              onClick={() =>
                                handleStatusUpdate(
                                  appointmentId,
                                  "completed"
                                )
                              }
                            >
                              {actionLoading ===
                              `${appointmentId}-completed`
                                ? "Completing..."
                                : "✓ Mark Completed"}
                            </button>
                          )}

                          {status === "completed" && (
                            <div className="completed-message">
                              ✓ Appointment completed
                            </div>
                          )}

                          {status === "rejected" && (
                            <div className="closed-message">
                              This appointment was rejected.
                            </div>
                          )}

                          {status === "cancelled" && (
                            <div className="closed-message">
                              This appointment was cancelled.
                            </div>
                          )}

                        </div>

                      </motion.article>
                    );
                  }
                )}

              </div>
            )}

        </section>

      </div>

    </div>
  );
};

export default DoctorDashboard;