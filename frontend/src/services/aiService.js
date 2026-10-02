import api from "./api";

// Known doctors with Render database IDs and credentials
export const DEFAULT_DOCTORS = [
  {
    _id: "6a83ba1184618eff8d44b18d",
    name: "Dr. Priya Mehta",
    specialization: "Cardiologist",
    email: "priya@rekhahospital.com",
    phone: "9876543212",
    experience: "10+ Years Experience",
    badge: "Heart & Vascular Specialist",
    rating: "4.9 ★",
    timing: "Mon - Sat (9:00 AM - 5:00 PM)",
    avatarIndex: 1,
  },
  {
    _id: "6a83ba1184618eff8d44b18e",
    name: "Dr. Arjun Patel",
    specialization: "Dermatologist",
    email: "arjun@rekhahospital.com",
    phone: "9876543213",
    experience: "8+ Years Experience",
    badge: "Skin, Hair & Allergy Specialist",
    rating: "4.8 ★",
    timing: "Mon - Sat (10:00 AM - 6:00 PM)",
    avatarIndex: 2,
  },
  {
    _id: "6a7de1952f9a1b047727a559",
    name: "Dr. Rahul Sharma",
    specialization: "General Physician",
    email: "doctor@rekhahospital.com",
    phone: "9876543211",
    experience: "12+ Years Experience",
    badge: "General Medicine & Family Health",
    rating: "4.9 ★",
    timing: "Mon - Sat (8:30 AM - 4:30 PM)",
    avatarIndex: 0,
  },
];

// Offline / fallback intelligent triage
export const getOfflineAiResponse = (message) => {
  const query = (message || "").toLowerCase().trim();

  const cardio = DEFAULT_DOCTORS[0]; // Dr. Priya Mehta
  const derma = DEFAULT_DOCTORS[1];  // Dr. Arjun Patel
  const general = DEFAULT_DOCTORS[2]; // Dr. Rahul Sharma

  // Critical Emergency
  if (
    query.includes("emergency") ||
    query.includes("heart attack") ||
    query.includes("cannot breathe") ||
    query.includes("chest pain") && (query.includes("severe") || query.includes("left arm") || query.includes("sweat")) ||
    query.includes("unconscious") ||
    query.includes("bleeding heavily")
  ) {
    return {
      success: true,
      isEmergency: true,
      category: "emergency",
      reply: `🚨 **EMERGENCY MEDICAL WARNING**\n\nThe symptoms described indicate a potentially life-threatening emergency.\n\n**Immediate Action Plan:**\n1. **Call Emergency Immediately:** Dial **108** or Rekha Hospital Emergency: **+91 98765 43210**\n2. Do NOT drive. Lie down with head slightly elevated.\n3. Our Emergency Cardiac Team led by **${cardio.name}** is on 24/7 alert.`,
      recommendedDoctor: cardio,
      suggestedActions: [
        { label: "📞 Emergency Helpline: +91 98765 43210", action: "emergency" },
        { label: `Book Priority Slot with ${cardio.name}`, action: "book", doctorId: cardio._id, doctorName: cardio.name, reason: "Urgent Cardiology Consultation" },
      ],
    };
  }

  // Cardiology / Priya Mehta
  if (
    query.includes("priya") ||
    query.includes("cardio") ||
    query.includes("heart") ||
    query.includes("chest pain") ||
    query.includes("blood pressure") ||
    query.includes("bp") ||
    query.includes("palpitation") ||
    query.includes("cholesterol") ||
    query.includes("angina") ||
    query.includes("pulse")
  ) {
    return {
      success: true,
      category: "cardiology",
      reply: `❤️ **Cardiology & Heart Care Recommendation**\n\nFor cardiovascular evaluation, chest tightness, or blood pressure concerns, we recommend an in-person consultation with **${cardio.name}** (${cardio.specialization}).\n\n**Clinical Focus:**\n• Comprehensive cardiac evaluation & ECG review\n• Hypertension & cholesterol management\n• Preventative cardiac health checks\n\n**Self-Care Tips:**\n• Rest quietly; avoid caffeine, smoking, or sudden physical strain.\n• Log any blood pressure readings to share with ${cardio.name}.`,
      recommendedDoctor: cardio,
      suggestedActions: [
        { label: `Book Appointment with ${cardio.name}`, action: "book", doctorId: cardio._id, doctorName: cardio.name, reason: "Heart & Cardiology Consultation" },
        { label: "View Heart Checkup Package", action: "navigate_services" },
      ],
    };
  }

  // Dermatology / Arjun Patel
  if (
    query.includes("arjun") ||
    query.includes("patel") ||
    query.includes("skin") ||
    query.includes("rash") ||
    query.includes("derma") ||
    query.includes("acne") ||
    query.includes("itching") ||
    query.includes("allergy") ||
    query.includes("eczema") ||
    query.includes("hair") ||
    query.includes("scalp") ||
    query.includes("fungal") ||
    query.includes("pimple") ||
    query.includes("dry skin")
  ) {
    return {
      success: true,
      category: "dermatology",
      reply: `🌿 **Dermatology & Skin Care Recommendation**\n\nFor skin irritation, rashes, chronic allergies, or hair concerns, **${derma.name}** (${derma.specialization}) is our specialist at Rekha Hospital.\n\n**Clinical Focus:**\n• Targeted allergy & dermatitis treatments\n• Clinical acne & scar management\n• Hair loss & scalp condition diagnosis\n\n**Preliminary Care Tips:**\n• Avoid scratching the area to prevent infection.\n• Cleanse gently with cool water; avoid harsh soaps and unverified steroid creams.`,
      recommendedDoctor: derma,
      suggestedActions: [
        { label: `Book Appointment with ${derma.name}`, action: "book", doctorId: derma._id, doctorName: derma.name, reason: "Skin & Dermatology Consultation" },
      ],
    };
  }

  // General Physician / Rahul Sharma
  if (
    query.includes("rahul") ||
    query.includes("sharma") ||
    query.includes("fever") ||
    query.includes("cold") ||
    query.includes("cough") ||
    query.includes("headache") ||
    query.includes("body pain") ||
    query.includes("weakness") ||
    query.includes("vomiting") ||
    query.includes("stomach") ||
    query.includes("flu") ||
    query.includes("diabetes") ||
    query.includes("infection") ||
    query.includes("general")
  ) {
    return {
      success: true,
      category: "general_medicine",
      reply: `🩺 **General Medicine Recommendation**\n\nFor symptoms such as fever, viral infection, seasonal flu, or overall health reviews, we advise consulting **${general.name}** (${general.specialization}).\n\n**Clinical Focus:**\n• Acute fever & viral infection protocols\n• Chronic condition management (Diabetes, Thyroid, BP)\n• Routine physical checkups\n\n**Home Recovery Guidance:**\n• Stay well hydrated with plenty of fluids and electrolytes.\n• Monitor temperature twice daily and get ample sleep.`,
      recommendedDoctor: general,
      suggestedActions: [
        { label: `Book Appointment with ${general.name}`, action: "book", doctorId: general._id, doctorName: general.name, reason: "General Physician Consultation" },
      ],
    };
  }

  // Doctor list / Who is available
  if (
    query.includes("doctor") ||
    query.includes("specialist") ||
    query.includes("who is") ||
    query.includes("who can i") ||
    query.includes("book")
  ) {
    return {
      success: true,
      category: "doctors_list",
      reply: `👨‍⚕️ **Doctors Available at Rekha Hospital**\n\nYou can book appointments with any of our verified medical specialists:\n\n1. **${cardio.name}** — *${cardio.specialization}*\n   Expert in heart disease, BP control, and cardiovascular health.\n\n2. **${derma.name}** — *${derma.specialization}*\n   Expert in skin care, rashes, allergies, and hair treatments.\n\n3. **${general.name}** — *${general.specialization}*\n   Expert in fever, infections, diabetes, and family medicine.\n\nClick on any specialist below to schedule an appointment directly!`,
      suggestedActions: [
        { label: `Book with ${cardio.name} (Cardiology)`, action: "book", doctorId: cardio._id, doctorName: cardio.name, reason: "Cardiology Appointment" },
        { label: `Book with ${derma.name} (Dermatology)`, action: "book", doctorId: derma._id, doctorName: derma.name, reason: "Dermatology Appointment" },
        { label: `Book with ${general.name} (General)`, action: "book", doctorId: general._id, doctorName: general.name, reason: "General Checkup" },
      ],
    };
  }

  // Default welcome response
  return {
    success: true,
    category: "general",
    reply: `Hello! 👋 I am the **Rekha Hospital 24/7 AI Healthcare Assistant**.\n\nI can help you:\n• **Analyze symptoms:** Tell me about any discomfort, chest tightness, fever, or skin issues.\n• **Find the right doctor:**\n  - ❤️ **${cardio.name}** (Cardiologist)\n  - 🌿 **${derma.name}** (Dermatologist)\n  - 🩺 **${general.name}** (General Physician)\n• **Book your appointment** with 1 click.\n\nHow can I help you today?`,
    suggestedActions: [
      { label: `Book with ${cardio.name} (Cardiology)`, action: "book", doctorId: cardio._id, doctorName: cardio.name, reason: "Heart Consultation" },
      { label: `Book with ${derma.name} (Dermatology)`, action: "book", doctorId: derma._id, doctorName: derma.name, reason: "Skin Consultation" },
      { label: `Book with ${general.name} (General)`, action: "book", doctorId: general._id, doctorName: general.name, reason: "General Checkup" },
    ],
  };
};

// Send message to AI assistant
export const sendAiMessage = async (message, history = []) => {
  try {
    const response = await api.post("/ai/chat", {
      message,
      history,
    });

    if (response.data?.success) {
      return response.data;
    }

    return getOfflineAiResponse(message);
  } catch (error) {
    console.warn("AI Backend API unavailable, utilizing intelligent local triage engine:", error.message);
    return getOfflineAiResponse(message);
  }
};
