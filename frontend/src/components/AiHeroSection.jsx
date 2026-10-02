import React from "react";
import { motion } from "framer-motion";
import "../styles/aiHeroSection.css";

import d2 from "../assets/doctor2.jpeg"; // Priya Mehta
import d3 from "../assets/doctor3.jpeg"; // Arjun Patel
import d1 from "../assets/doctor1.jpeg"; // Rahul Sharma

export default function AiHeroSection() {
  const handleOpenAi = (query = "") => {
    window.dispatchEvent(
      new CustomEvent("open-ai-assistant", {
        detail: { query },
      })
    );
  };

  const handleBookDoctor = (doctorId, doctorName, specialization, reason) => {
    window.dispatchEvent(
      new CustomEvent("select-doctor", {
        detail: {
          doctorId,
          doctorName,
          specialization,
          reason,
        },
      })
    );

    const el = document.getElementById("appointment");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="ai-hero-section" id="ai-assistance">
      <div className="ai-hero-orb ai-hero-orb-1"></div>
      <div className="ai-hero-orb ai-hero-orb-2"></div>

      <div className="ai-hero-container">
        {/* TOP BADGE */}
        <motion.div
          className="ai-hero-badge"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge-sparkle">✨</span>
          <span>POWERED BY MEDICAL AI & SPECIALIST NETWORK</span>
          <span className="badge-status">● Live 24/7</span>
        </motion.div>

        {/* HEADLINE */}
        <motion.div
          className="ai-hero-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h2>
            AI Healthcare Assistance
            <span> & Instant Doctor Booking</span>
          </h2>
          <p>
            Unsure which specialist you need? Our AI Healthcare Assistant evaluates your
            symptoms in real time, provides medical triage guidance, and instantly books your
            appointment with <strong>Dr. Priya Mehta</strong>, <strong>Dr. Arjun Patel</strong>, or <strong>Dr. Rahul Sharma</strong>.
          </p>
        </motion.div>

        {/* 3 SPECIALIST CARDS WITH 1-CLICK BOOKING */}
        <div className="ai-specialist-cards">
          {/* DR. PRIYA MEHTA */}
          <motion.div
            className="ai-spec-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            whileHover={{ y: -8 }}
          >
            <div className="ai-card-glow priya-glow"></div>
            <div className="ai-card-badge-row">
              <span className="ai-card-spec-tag heart-tag">❤️ Cardiology</span>
              <span className="ai-card-avail">Available</span>
            </div>

            <div className="ai-card-doctor-info">
              <img src={d2} alt="Dr. Priya Mehta" className="ai-card-avatar" />
              <div>
                <h3>Dr. Priya Mehta</h3>
                <span className="ai-card-role">Chief Cardiologist</span>
                <small>Heart, BP & Cardiovascular Care</small>
              </div>
            </div>

            <p className="ai-card-desc">
              Specialized in heart palpitations, chest tightness, high BP management, ECG diagnosis, and preventative cardiac health.
            </p>

            <div className="ai-card-actions">
              <button
                type="button"
                className="ai-card-book-btn"
                onClick={() =>
                  handleBookDoctor(
                    "6a83ba1184618eff8d44b18d",
                    "Dr. Priya Mehta",
                    "Cardiologist",
                    "Cardiology & Heart Consultation with Dr. Priya Mehta"
                  )
                }
              >
                <span>Book Dr. Priya Mehta</span>
                <span>→</span>
              </button>
              <button
                type="button"
                className="ai-card-chat-btn"
                onClick={() => handleOpenAi("I have chest pain and need Dr. Priya Mehta's advice")}
              >
                Ask AI About Heart
              </button>
            </div>
          </motion.div>

          {/* DR. ARJUN PATEL */}
          <motion.div
            className="ai-spec-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            whileHover={{ y: -8 }}
          >
            <div className="ai-card-glow arjun-glow"></div>
            <div className="ai-card-badge-row">
              <span className="ai-card-spec-tag derma-tag">🌿 Dermatology</span>
              <span className="ai-card-avail">Available</span>
            </div>

            <div className="ai-card-doctor-info">
              <img src={d3} alt="Dr. Arjun Patel" className="ai-card-avatar" />
              <div>
                <h3>Dr. Arjun Patel</h3>
                <span className="ai-card-role">Senior Dermatologist</span>
                <small>Skin, Hair & Allergy Specialist</small>
              </div>
            </div>

            <p className="ai-card-desc">
              Expert in chronic skin rashes, severe acne, allergic eczema, psoriasis, fungal conditions, and scalp/hair treatments.
            </p>

            <div className="ai-card-actions">
              <button
                type="button"
                className="ai-card-book-btn"
                onClick={() =>
                  handleBookDoctor(
                    "6a83ba1184618eff8d44b18e",
                    "Dr. Arjun Patel",
                    "Dermatologist",
                    "Dermatology & Skin Consultation with Dr. Arjun Patel"
                  )
                }
              >
                <span>Book Dr. Arjun Patel</span>
                <span>→</span>
              </button>
              <button
                type="button"
                className="ai-card-chat-btn"
                onClick={() => handleOpenAi("I have a skin rash and itchiness, what should I do?")}
              >
                Ask AI About Skin
              </button>
            </div>
          </motion.div>

          {/* DR. RAHUL SHARMA */}
          <motion.div
            className="ai-spec-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            whileHover={{ y: -8 }}
          >
            <div className="ai-card-glow rahul-glow"></div>
            <div className="ai-card-badge-row">
              <span className="ai-card-spec-tag general-tag">🩺 General Medicine</span>
              <span className="ai-card-avail">Available</span>
            </div>

            <div className="ai-card-doctor-info">
              <img src={d1} alt="Dr. Rahul Sharma" className="ai-card-avatar" />
              <div>
                <h3>Dr. Rahul Sharma</h3>
                <span className="ai-card-role">Senior General Physician</span>
                <small>Internal Medicine & Family Care</small>
              </div>
            </div>

            <p className="ai-card-desc">
              Expert in acute viral fever, seasonal influenza, digestive disorders, diabetes control, and annual full-body checkups.
            </p>

            <div className="ai-card-actions">
              <button
                type="button"
                className="ai-card-book-btn"
                onClick={() =>
                  handleBookDoctor(
                    "6a7de1952f9a1b047727a559",
                    "Dr. Rahul Sharma",
                    "General Physician",
                    "General Health Consultation with Dr. Rahul Sharma"
                  )
                }
              >
                <span>Book Dr. Rahul Sharma</span>
                <span>→</span>
              </button>
              <button
                type="button"
                className="ai-card-chat-btn"
                onClick={() => handleOpenAi("I have fever and body fatigue, how can I recover?")}
              >
                Ask AI About Fever
              </button>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM AI PROMPT STRIP */}
        <motion.div
          className="ai-cta-strip"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <div className="ai-cta-content">
            <span className="ai-cta-robot">🤖</span>
            <div>
              <h4>Have specific symptoms? Ask our AI Assistant now</h4>
              <p>Get immediate preliminary triage, self-care guidance, and doctor suggestions in seconds.</p>
            </div>
          </div>
          <button
            type="button"
            className="ai-cta-open-btn"
            onClick={() => handleOpenAi()}
          >
            <span>Launch AI Healthcare Assistant</span>
            <span>✨</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
