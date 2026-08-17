import { motion } from "framer-motion";
import "../styles/services.css";

const Services = () => {
  const services = [
    {
      number: "01",
      icon: "✚",
      title: "24/7 Emergency Care",
      description:
        "Immediate medical attention whenever you need it, supported by experienced healthcare professionals.",
      tag: "Emergency",
      featured: true,
    },
    {
      number: "02",
      icon: "♡",
      title: "Heart Checkup",
      description:
        "Comprehensive cardiac evaluation designed to help monitor and protect your heart health.",
      tag: "Cardiology",
    },
    {
      number: "03",
      icon: "⌁",
      title: "Blood Test",
      description:
        "Reliable diagnostic testing with accurate results to support better medical decisions.",
      tag: "Diagnostics",
    },
    {
      number: "04",
      icon: "◉",
      title: "X-Ray & Scanning",
      description:
        "Modern diagnostic imaging to help doctors understand your condition with greater clarity.",
      tag: "Imaging",
    },
    {
      number: "05",
      icon: "♡",
      title: "Maternity Care",
      description:
        "Compassionate maternity support focused on comfort, safety and personalized care.",
      tag: "Women Care",
    },
  ];

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
    <section className="services" id="services">

      {/* BACKGROUND ORBS */}

      <div className="services-orb services-orb-one"></div>
      <div className="services-orb services-orb-two"></div>


      {/* HEADER */}

      <motion.div
        className="services-header"
        initial={{
          opacity: 0,
          y: 35,
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

        <span className="services-eyebrow">
          WHAT WE PROVIDE
        </span>

        <h2>
          Healthcare Designed
          <span> Around You.</span>
        </h2>

        <p>
          From emergency support to advanced diagnostics,
          our healthcare services are designed to provide
          reliable, compassionate and personalized care
          at every stage of your journey.
        </p>

      </motion.div>


      {/* SERVICES GRID */}

      <div className="services-grid">

        {services.map((service, index) => (

          <motion.article
            key={service.number}
            className={`service-card ${
              service.featured
                ? "service-card-featured"
                : ""
            }`}
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.96,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              y: -10,
              scale: 1.015,
            }}
          >

            {/* CARD TOP */}

            <div className="service-card-top">

              <span className="service-number">
                {service.number}
              </span>

              <span className="service-tag">
                {service.tag}
              </span>

            </div>


            {/* ICON */}

            <motion.div
              className="service-icon"
              whileHover={{
                rotate: 8,
                scale: 1.1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
            >
              {service.icon}
            </motion.div>


            {/* CONTENT */}

            <div className="service-content">

              <h3>
                {service.title}
              </h3>

              <p>
                {service.description}
              </p>

            </div>


            {/* BOTTOM */}

            <div className="service-card-bottom">

              <span>
                Explore Service
              </span>

              <motion.span
                className="service-arrow"
                whileHover={{
                  x: 5,
                }}
              >
                →
              </motion.span>

            </div>


            {/* GLOW */}

            <div className="service-card-glow"></div>

          </motion.article>

        ))}

      </div>


      {/* CTA */}

      <motion.div
        className="services-cta"
        initial={{
          opacity: 0,
          y: 35,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.8,
          delay: 0.15,
        }}
      >

        <div className="services-cta-content">

          <div className="services-cta-icon">
            +
          </div>

          <div>

            <strong>
              Need medical assistance?
            </strong>

            <p>
              Book an appointment with our specialists.
            </p>

          </div>

        </div>


        <button
          type="button"
          className="services-cta-button"
          onClick={scrollToAppointment}
        >
          Book Appointment

          <span>
            →
          </span>
        </button>

      </motion.div>

    </section>
  );
};

export default Services;