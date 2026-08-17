import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import "../styles/doctors.css";

import d1 from "../assets/doctor1.jpeg";
import d2 from "../assets/doctor2.jpeg";
import d3 from "../assets/doctor3.jpeg";

import api from "../services/api.js";

const fallbackImages = [d1, d2, d3];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.94,
  },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.12,
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/doctors");

      console.log("Doctors API response:", response.data);

      if (response.data?.success) {
        setDoctors(response.data.doctors || []);
      } else {
        setError(
          response.data?.message ||
            "Unable to load doctors."
        );
      }
    } catch (err) {
      console.error("Doctor loading error:", err);
      console.error("Status:", err.response?.status);
      console.error("Response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load doctors. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleAppointment = () => {
    const appointmentSection =
      document.getElementById("appointment");

    if (appointmentSection) {
      appointmentSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="doctors" id="doctors">

      {/* =========================================
          BACKGROUND DECORATION
      ========================================= */}

      <div className="doctors-orb doctors-orb-one"></div>
      <div className="doctors-orb doctors-orb-two"></div>

      <div className="doctors-grid-background"></div>


      {/* =========================================
          HEADER
      ========================================= */}

      <motion.div
        className="doctors-header"
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.25,
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >

        <motion.div
          className="doctors-eyebrow"
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
        >
          <span className="eyebrow-dot"></span>

          OUR SPECIALISTS
        </motion.div>


        <h2>
          Meet Our
          <span> Expert Doctors</span>
        </h2>


        <p>
          Experienced medical professionals dedicated
          to providing compassionate, personalized and
          modern healthcare designed around you.
        </p>


        <div className="doctors-heading-line">
          <span></span>
          <span></span>
          <span></span>
        </div>

      </motion.div>


      {/* =========================================
          LOADING
      ========================================= */}

      {loading && (

        <div className="doctors-loading">

          {[1, 2, 3].map((item) => (

            <div
              className="doctor-skeleton-card"
              key={item}
            >

              <div className="skeleton skeleton-image"></div>

              <div className="skeleton skeleton-small"></div>

              <div className="skeleton skeleton-title"></div>

              <div className="skeleton skeleton-text"></div>

              <div className="skeleton skeleton-button"></div>

            </div>

          ))}

        </div>

      )}


      {/* =========================================
          ERROR
      ========================================= */}

      {!loading && error && (

        <motion.div
          className="doctors-error"
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
        >

          <div className="error-icon">
            !
          </div>

          <h3>
            Unable to load our specialists
          </h3>

          <p>
            {error}
          </p>

          <motion.button
            type="button"
            onClick={loadDoctors}
            whileHover={{
              y: -3,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.96,
            }}
          >
            Try Again
          </motion.button>

        </motion.div>

      )}


      {/* =========================================
          DOCTOR CARDS
      ========================================= */}

      {!loading &&
        !error &&
        doctors.length > 0 && (

          <div className="doctor-list">

            {doctors.map((doctor, index) => (

              <motion.article
                key={doctor._id}
                className="doctor-card"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                whileHover={{
                  y: -12,
                  rotateX: 2,
                  rotateY: -2,
                }}
              >

                {/* =================================
                    CARD GLOW
                ================================= */}

                <div className="doctor-card-glow"></div>


                {/* =================================
                    IMAGE
                ================================= */}

                <div className="doctor-image-wrapper">

                  <img
                    src={
                      doctor.avatar ||
                      fallbackImages[
                        index % fallbackImages.length
                      ]
                    }
                    alt={
                      doctor.name ||
                      "Hospital Doctor"
                    }
                    className="doctor-image"
                  />


                  <div className="doctor-image-overlay"></div>


                  {/* AVAILABILITY */}

                  <div className="doctor-status">

                    <span className="status-dot"></span>

                    <span>
                      Available
                    </span>

                  </div>


                  {/* TOP BADGE */}

                  <div className="doctor-specialist-badge">
                    <span>✦</span>
                    Specialist
                  </div>


                  {/* IMAGE PLUS */}

                  <div className="doctor-image-plus">
                    +
                  </div>

                </div>


                {/* =================================
                    INFORMATION
                ================================= */}

                <div className="doctor-info">

                  <div className="doctor-top-line">

                    <span className="doctor-role">
                      MEDICAL SPECIALIST
                    </span>

                    <span className="doctor-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                  </div>


                  <h3>
                    {doctor.name ||
                      "Hospital Doctor"}
                  </h3>


                  <p className="doctor-speciality">

                    {doctor.specialization ||
                      "Experienced Medical Professional"}

                  </p>


                  {/* DETAILS */}

                  <div className="doctor-details">

                    {doctor.email && (

                      <div className="doctor-detail">

                        <span className="detail-icon">
                          @
                        </span>

                        <span>
                          {doctor.email}
                        </span>

                      </div>

                    )}


                    {doctor.phone && (

                      <div className="doctor-detail">

                        <span className="detail-icon">
                          ☎
                        </span>

                        <span>
                          {doctor.phone}
                        </span>

                      </div>

                    )}

                  </div>


                  {/* DIVIDER */}

                  <div className="doctor-divider"></div>


                  {/* APPOINTMENT */}

                  <motion.button
                    type="button"
                    className="doctor-book-btn"
                    onClick={handleAppointment}
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >

                    <span>
                      Book Appointment
                    </span>

                    <span className="doctor-btn-arrow">
                      →
                    </span>

                  </motion.button>

                </div>

              </motion.article>

            ))}

          </div>

        )}


      {/* =========================================
          EMPTY STATE
      ========================================= */}

      {!loading &&
        !error &&
        doctors.length === 0 && (

          <motion.div
            className="doctors-empty"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >

            <div className="empty-icon">
              ✦
            </div>

            <h3>
              Our specialists are being updated
            </h3>

            <p>
              Our medical team information is currently
              being updated. Please check back shortly.
            </p>

            <button
              type="button"
              onClick={loadDoctors}
            >
              Refresh Specialists
            </button>

          </motion.div>

        )}


      {/* =========================================
          BOTTOM TRUST STRIP
      ========================================= */}

      {!loading &&
        !error &&
        doctors.length > 0 && (

          <motion.div
            className="doctors-trust-strip"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.8,
            }}
          >

            <div className="trust-item">

              <span className="trust-icon">
                ✦
              </span>

              <div>
                <strong>
                  Experienced Team
                </strong>

                <small>
                  Skilled healthcare professionals
                </small>
              </div>

            </div>


            <div className="trust-item">

              <span className="trust-icon">
                ♡
              </span>

              <div>
                <strong>
                  Patient First
                </strong>

                <small>
                  Compassionate medical care
                </small>
              </div>

            </div>


            <div className="trust-item">

              <span className="trust-icon">
                +
              </span>

              <div>
                <strong>
                  24/7 Support
                </strong>

                <small>
                  Healthcare when you need it
                </small>
              </div>

            </div>

          </motion.div>

        )}

    </section>
  );
};

export default Doctors;