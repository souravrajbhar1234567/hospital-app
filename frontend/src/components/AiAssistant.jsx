import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendAiMessage, DEFAULT_DOCTORS } from "../services/aiService.js";
import "../styles/aiAssistant.css";

import d1 from "../assets/doctor1.jpeg";
import d2 from "../assets/doctor2.jpeg";
import d3 from "../assets/doctor3.jpeg";

const doctorPhotos = [d1, d2, d3];

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hello! 👋 I am your **Rekha Hospital AI Healthcare Assistant**.\n\nI can help analyze your symptoms, give first-aid guidance, and match you with our expert doctors for fast appointment booking:\n\n• ❤️ **Dr. Priya Mehta** — *Cardiologist (Heart & BP)*\n• 🌿 **Dr. Arjun Patel** — *Dermatologist (Skin & Hair)*\n• 🩺 **Dr. Rahul Sharma** — *General Physician (General Health)*\n\nHow can I help you today?",
      suggestedActions: [
        {
          label: "❤️ Book with Dr. Priya Mehta (Cardiology)",
          action: "book",
          doctorId: "6a83ba1184618eff8d44b18d",
          doctorName: "Dr. Priya Mehta",
          reason: "Heart & Cardiology Checkup",
        },
        {
          label: "🌿 Book with Dr. Arjun Patel (Dermatology)",
          action: "book",
          doctorId: "6a83ba1184618eff8d44b18e",
          doctorName: "Dr. Arjun Patel",
          reason: "Skin & Dermatology Consultation",
        },
        {
          label: "🩺 Book with Dr. Rahul Sharma (General)",
          action: "book",
          doctorId: "6a7de1952f9a1b047727a559",
          doctorName: "Dr. Rahul Sharma",
          reason: "General Health Consultation",
        },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  // Listen to open-ai-assistant custom events
  useEffect(() => {
    const handleOpenAi = (e) => {
      setIsOpen(true);
      setIsMinimized(false);
      if (e.detail?.query) {
        handleSendQuery(e.detail.query);
      }
    };

    window.addEventListener("open-ai-assistant", handleOpenAi);
    return () => window.removeEventListener("open-ai-assistant", handleOpenAi);
  }, []);

  // Format markdown-like bold and bullet points
  const formatText = (text) => {
    if (!text) return "";
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Process bold **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={pIdx}>{part.slice(1, -1)}</em>;
        }
        return part;
      });

      return (
        <span key={idx} className="chat-text-line">
          {renderedParts}
          {idx < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  // Direct Book Doctor action
  const handleBookDoctor = (doctorId, doctorName, reason = "") => {
    // Dispatch global event for Appointment component
    window.dispatchEvent(
      new CustomEvent("select-doctor", {
        detail: {
          doctorId,
          doctorName,
          reason: reason || `Consultation requested via AI Health Assistant`,
        },
      })
    );

    // Minimize AI chat so user can see form
    setIsMinimized(true);

    // Smooth scroll to appointment section
    setTimeout(() => {
      const el = document.getElementById("appointment");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  // Send message
  const handleSend = async (e) => {
    e?.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    setInput("");
    await handleSendQuery(query);
  };

  const handleSendQuery = async (query) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await sendAiMessage(query);

      let recommendedDocObj = null;
      if (response.recommendedDoctor) {
        const docId = response.recommendedDoctor.id || response.recommendedDoctor._id;
        const matched = DEFAULT_DOCTORS.find((d) => d._id === docId);
        recommendedDocObj = matched || {
          _id: docId,
          name: response.recommendedDoctor.name,
          specialization: response.recommendedDoctor.specialization,
          phone: response.recommendedDoctor.phone,
        };
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.reply,
        isEmergency: response.isEmergency,
        category: response.category,
        recommendedDoctor: recommendedDocObj,
        suggestedActions: response.suggestedActions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("AI Assistant error:", err);
      const errorMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "I am having trouble connecting to the network right now. However, you can directly book an appointment with our specialists below:\n\n• **Dr. Priya Mehta** (Cardiologist)\n• **Dr. Arjun Patel** (Dermatologist)\n• **Dr. Rahul Sharma** (General Physician)",
        suggestedActions: [
          { label: "Book Dr. Priya Mehta", action: "book", doctorId: "6a83ba1184618eff8d44b18d", doctorName: "Dr. Priya Mehta" },
          { label: "Book Dr. Arjun Patel", action: "book", doctorId: "6a83ba1184618eff8d44b18e", doctorName: "Dr. Arjun Patel" },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: "Chat cleared. 👋 How can I help you today? Ask about symptoms, or choose a specialist to book an appointment directly:",
        suggestedActions: [
          { label: "❤️ Book with Dr. Priya Mehta (Cardiology)", action: "book", doctorId: "6a83ba1184618eff8d44b18d", doctorName: "Dr. Priya Mehta", reason: "Cardiology Consultation" },
          { label: "🌿 Book with Dr. Arjun Patel (Dermatology)", action: "book", doctorId: "6a83ba1184618eff8d44b18e", doctorName: "Dr. Arjun Patel", reason: "Dermatology Consultation" },
          { label: "🩺 Book with Dr. Rahul Sharma (General)", action: "book", doctorId: "6a7de1952f9a1b047727a559", doctorName: "Dr. Rahul Sharma", reason: "General Health Consultation" },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const getDoctorPhoto = (doc) => {
    if (!doc) return doctorPhotos[0];
    if (doc.name?.toLowerCase().includes("priya")) return d2;
    if (doc.name?.toLowerCase().includes("arjun")) return d3;
    return d1;
  };

  return (
    <>
      {/* FLOATING LAUNCHER BUTTON */}
      <div className="ai-launcher-wrapper">
        <motion.button
          type="button"
          className="ai-launcher-btn"
          onClick={() => {
            setIsOpen((prev) => !prev);
            setIsMinimized(false);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Open AI Healthcare Assistant"
        >
          <div className="ai-launcher-pulse"></div>
          <div className="ai-launcher-icon">
            <span className="ai-sparkle-icon">✨</span>
            <span className="ai-bot-avatar">🤖</span>
          </div>
          <div className="ai-launcher-label">
            <strong>AI Health Assistant</strong>
            <small>Online • 24/7</small>
          </div>
          <span className="ai-launcher-badge">Free</span>
        </motion.button>
      </div>

      {/* CHAT MODAL / DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`ai-chat-window ${isMinimized ? "minimized" : ""}`}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* HEADER */}
            <div className="ai-chat-header">
              <div className="ai-chat-header-info">
                <div className="ai-avatar-badge">
                  <span>🤖</span>
                  <span className="ai-status-dot"></span>
                </div>
                <div>
                  <h3>
                    Rekha AI Health Assistant
                    <span className="ai-verified-tag">✓ Verified</span>
                  </h3>
                  <p>24/7 Medical Triage & Specialist Match</p>
                </div>
              </div>

              <div className="ai-header-actions">
                <button
                  type="button"
                  className="ai-header-btn"
                  title="Clear chat"
                  onClick={clearChat}
                >
                  ↺
                </button>
                <button
                  type="button"
                  className="ai-header-btn"
                  title={isMinimized ? "Expand" : "Minimize"}
                  onClick={() => setIsMinimized((prev) => !prev)}
                >
                  {isMinimized ? "▢" : "—"}
                </button>
                <button
                  type="button"
                  className="ai-header-btn close"
                  title="Close"
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* BODY (WHEN NOT MINIMIZED) */}
            {!isMinimized && (
              <>
                {/* MESSAGES LIST */}
                <div className="ai-messages-container">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`ai-message-row ${msg.sender} ${msg.isEmergency ? "emergency" : ""}`}
                    >
                      {msg.sender === "bot" && (
                        <div className="ai-msg-avatar">
                          <span>🤖</span>
                        </div>
                      )}

                      <div className="ai-msg-bubble">
                        <div className="ai-msg-content">
                          {formatText(msg.text)}
                        </div>

                        {/* DOCTOR RECOMMENDATION CARD IN CHAT */}
                        {msg.recommendedDoctor && (
                          <motion.div
                            className="ai-doctor-card"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            <div className="ai-doctor-card-top">
                              <img
                                src={getDoctorPhoto(msg.recommendedDoctor)}
                                alt={msg.recommendedDoctor.name}
                                className="ai-doctor-thumb"
                              />
                              <div className="ai-doctor-meta">
                                <span className="ai-specialist-label">RECOMMENDED SPECIALIST</span>
                                <h4>{msg.recommendedDoctor.name}</h4>
                                <span className="ai-doc-spec">
                                  {msg.recommendedDoctor.specialization}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="ai-book-now-btn"
                              onClick={() =>
                                handleBookDoctor(
                                  msg.recommendedDoctor._id || msg.recommendedDoctor.id,
                                  msg.recommendedDoctor.name,
                                  `Consultation with ${msg.recommendedDoctor.name} via AI Assistant`
                                )
                              }
                            >
                              <span>Book Appointment with {msg.recommendedDoctor.name}</span>
                              <span className="btn-arrow">→</span>
                            </button>
                          </motion.div>
                        )}

                        {/* SUGGESTED ACTION BUTTONS */}
                        {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                          <div className="ai-actions-wrap">
                            {msg.suggestedActions.map((act, aIdx) => (
                              <button
                                key={aIdx}
                                type="button"
                                className="ai-action-chip"
                                onClick={() => {
                                  if (act.action === "book" && act.doctorId) {
                                    handleBookDoctor(act.doctorId, act.doctorName, act.reason);
                                  } else {
                                    handleSendQuery(act.label);
                                  }
                                }}
                              >
                                {act.label}
                              </button>
                            ))}
                          </div>
                        )}

                        <span className="ai-msg-time">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="ai-message-row bot">
                      <div className="ai-msg-avatar">
                        <span>🤖</span>
                      </div>
                      <div className="ai-msg-bubble typing">
                        <div className="ai-typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span className="ai-typing-text">Analyzing your symptoms...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* PROMPT SUGGESTION CHIPS */}
                <div className="ai-quick-prompts">
                  {[
                    "❤️ Book Dr. Priya Mehta (Cardiology)",
                    "🌿 Book Dr. Arjun Patel (Dermatology)",
                    "🩺 Book Dr. Rahul Sharma (General)",
                    "🔍 Chest pain & heart checkup",
                    "🌾 Skin allergy / rash advice",
                  ].map((promptText, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      className="ai-prompt-chip"
                      onClick={() => handleSendQuery(promptText)}
                      disabled={loading}
                    >
                      {promptText}
                    </button>
                  ))}
                </div>

                {/* CHAT INPUT FORM */}
                <form className="ai-chat-input-area" onSubmit={handleSend}>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Describe symptoms or ask to book a doctor..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="ai-send-btn"
                    disabled={!input.trim() || loading}
                    aria-label="Send query"
                  >
                    <span>➔</span>
                  </button>
                </form>

                {/* FOOTER DISCLAIMER */}
                <div className="ai-chat-disclaimer">
                  <span>ℹ️ AI guidance only. For medical emergencies, call 108 or hospital 24/7.</span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
