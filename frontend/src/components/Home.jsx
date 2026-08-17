import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import "../styles/home.css";
import banner from "../assets/hospital-banner.jpeg";

const Home = () => {
  const navigate = useNavigate();

  const scrollToAppointment = () => {
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
    <section className="home" id="home">

      {/* =================================================
          BACKGROUND IMAGE
      ================================================= */}

      <div className="home-background">

        <img
          src={banner}
          alt="Rekha Hospital"
          className="home-background-image"
        />

        <div className="home-background-overlay"></div>

        <div className="home-background-gradient"></div>

      </div>


      {/* =================================================
          DECORATIVE LIGHT
      ================================================= */}

      <div className="home-light home-light-one"></div>

      <div className="home-light home-light-two"></div>


      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="home-container">

        <motion.div
          className="home-content"
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          {/* EYEBROW */}

          <motion.div
            className="home-eyebrow"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
              duration: 0.7,
            }}
          >

            <span className="home-eyebrow-dot"></span>

            <span>
              ADVANCED HEALTHCARE • 24/7
            </span>

          </motion.div>


          {/* HEADING */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.25,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            Your Health.

            <span>
              Our Commitment.
            </span>

          </motion.h1>


          {/* DESCRIPTION */}

          <motion.p
            className="home-description"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
              duration: 0.8,
            }}
          >

            Experience compassionate healthcare
            powered by modern medical expertise,
            experienced specialists and technology
            designed around you.

          </motion.p>


          {/* BUTTONS */}

          <motion.div
            className="home-actions"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.55,
              duration: 0.8,
            }}
          >

            <motion.button
              type="button"
              className="home-primary-btn"
              onClick={scrollToAppointment}
              whileHover={{
                y: -4,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >

              <span>
                Book Appointment
              </span>

              <span className="home-button-arrow">
                →
              </span>

            </motion.button>


            <motion.button
              type="button"
              className="home-secondary-btn"
              onClick={() => navigate("/register")}
              whileHover={{
                y: -4,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >

              Get Started

            </motion.button>

          </motion.div>


          {/* TRUST */}

          <motion.div
            className="home-trust"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.75,
              duration: 0.8,
            }}
          >

            <div className="home-trust-avatars">

              <span>R</span>
              <span>S</span>
              <span>A</span>
              <span>+</span>

            </div>

            <div className="home-trust-text">

              <strong>
                Trusted by patients
              </strong>

              <span>
                Quality care, every day
              </span>

            </div>

          </motion.div>

        </motion.div>


        {/* =================================================
            FLOATING HEALTH CARD
        ================================================= */}

        <motion.div
          className="home-floating-card home-floating-card-main"
          initial={{
            opacity: 0,
            x: 40,
            y: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
          }}
          transition={{
            delay: 0.7,
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          <div className="floating-card-icon">
            +
          </div>

          <div className="floating-card-content">

            <span>
              Patient Care
            </span>

            <strong>
              Available 24/7
            </strong>

          </div>

          <div className="floating-card-status">
            <span></span>
          </div>

        </motion.div>


        {/* =================================================
            FLOATING STAT CARD
        ================================================= */}

        <motion.div
          className="home-floating-card home-floating-card-stat"
          initial={{
            opacity: 0,
            x: 30,
            y: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
          }}
          transition={{
            delay: 0.9,
            duration: 1,
          }}
        >

          <div className="stat-number">
            24<span>/7</span>
          </div>

          <div className="stat-label">
            Medical Support
          </div>

        </motion.div>


        {/* =================================================
            SCROLL INDICATOR
        ================================================= */}

        <motion.div
          className="home-scroll"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.3,
            duration: 1,
          }}
        >

          <span>
            SCROLL TO EXPLORE
          </span>

          <div className="home-scroll-line">

            <motion.div
              animate={{
                y: [0, 22, 0],
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 1.7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

          </div>

        </motion.div>

      </div>


      {/* =================================================
          BOTTOM GLASS STRIP
      ================================================= */}

      <div className="home-bottom-strip">

        <div className="home-bottom-item">

          <span className="bottom-icon">
            ✦
          </span>

          <div>
            <strong>
              Expert Specialists
            </strong>

            <small>
              Experienced medical team
            </small>
          </div>

        </div>


        <div className="home-bottom-item">

          <span className="bottom-icon">
            ♡
          </span>

          <div>
            <strong>
              Patient First
            </strong>

            <small>
              Care designed around you
            </small>
          </div>

        </div>


        <div className="home-bottom-item">

          <span className="bottom-icon">
            +
          </span>

          <div>
            <strong>
              Modern Healthcare
            </strong>

            <small>
              Advanced medical support
            </small>
          </div>

        </div>

      </div>

    </section>
  );
};

export default Home;