import User from "../models/User.js";

// ==========================================
// AI HEALTHCARE ASSISTANT CONTROLLER
// Rekha Hospital 24/7 Medical Triage & Guidance
// ==========================================

export const chatWithAi = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const userQuery = message.trim().toLowerCase();

    // Fetch active doctors from database
    const doctors = await User.find({
      role: "doctor",
      isActive: true,
    }).select("name email phone avatar specialization");

    // Match specialists
    const cardioDoctor = doctors.find((d) =>
      d.specialization?.toLowerCase().includes("cardio") ||
      d.name?.toLowerCase().includes("priya")
    ) || {
      _id: "6a83ba1184618eff8d44b18d",
      name: "Dr. Priya Mehta",
      specialization: "Cardiologist",
      phone: "9876543212",
    };

    const dermaDoctor = doctors.find((d) =>
      d.specialization?.toLowerCase().includes("dermat") ||
      d.name?.toLowerCase().includes("arjun")
    ) || {
      _id: "6a83ba1184618eff8d44b18e",
      name: "Dr. Arjun Patel",
      specialization: "Dermatologist",
      phone: "9876543213",
    };

    const generalDoctor = doctors.find((d) =>
      d.specialization?.toLowerCase().includes("general") ||
      d.name?.toLowerCase().includes("rahul")
    ) || {
      _id: "6a7de1952f9a1b047727a559",
      name: "Dr. Rahul Sharma",
      specialization: "General Physician",
      phone: "9876543211",
    };

    // Evaluate symptoms & intents
    let reply = "";
    let recommendedDoctor = null;
    let category = "general";
    let isEmergency = false;
    let suggestedActions = [];

    // Emergency check
    const emergencyKeywords = [
      "severe chest pain",
      "heart attack",
      "stroke",
      "cannot breathe",
      "unconscious",
      "heavy bleeding",
      "fainting",
      "cyanosis",
      "choking",
      "cardiac arrest",
    ];

    if (emergencyKeywords.some((k) => userQuery.includes(k))) {
      isEmergency = true;
      category = "emergency";
      recommendedDoctor = cardioDoctor;
      reply = `🚨 **CRITICAL MEDICAL ALERT**\n\nThe symptoms you reported may require immediate emergency intervention!\n\n**Immediate Steps:**\n1. Call emergency services immediately: **108** or Rekha Hospital Emergency Helpline: **+91 98765 43210**.\n2. Do NOT drive yourself to the hospital; have someone accompany you or await the ambulance.\n3. Sit in an upright, comfortable position and loosen tight clothing.\n\nOur Chief Cardiologist **${cardioDoctor.name}** and the 24/7 ICU & Trauma Team are on active standby.`;
      suggestedActions = [
        { label: "Call Emergency (+91 98765 43210)", action: "call_emergency" },
        { label: `Book Emergency Consultation with ${cardioDoctor.name}`, action: "book_doctor", doctorId: cardioDoctor._id, doctorName: cardioDoctor.name },
      ];
    }
    // Direct doctor request: Priya Mehta / Cardiology
    else if (
      userQuery.includes("priya") ||
      userQuery.includes("cardio") ||
      userQuery.includes("heart") ||
      userQuery.includes("chest pain") ||
      userQuery.includes("blood pressure") ||
      userQuery.includes("bp") ||
      userQuery.includes("palpitation") ||
      userQuery.includes("cholesterol") ||
      userQuery.includes("ecg")
    ) {
      category = "cardiology";
      recommendedDoctor = cardioDoctor;
      reply = `❤️ **Cardiology & Heart Care Recommendation**\n\nFor heart health, chest tightness, palpitations, and blood pressure monitoring, we strongly recommend consulting **${cardioDoctor.name}**, our Senior Cardiologist at Rekha Hospital.\n\n**Specialist Details:**\n• **Specialization:** ${cardioDoctor.specialization}\n• **Key Expertise:** ECG analysis, cardiac stress evaluation, hypertension control, preventative heart screening\n• **OPD Availability:** Monday to Saturday, 9:00 AM - 5:00 PM\n\n**Health Guidance:**\n• Avoid strenuous exertion while experiencing discomfort.\n• Monitor your resting blood pressure if a digital monitor is available.\n• Note down when symptoms occur to share with ${cardioDoctor.name}.`;
      suggestedActions = [
        { label: `Book Appointment with ${cardioDoctor.name}`, action: "book_doctor", doctorId: cardioDoctor._id, doctorName: cardioDoctor.name, specialization: cardioDoctor.specialization },
        { label: "Heart Checkup Package Info", action: "service_info", service: "Heart Checkup" },
      ];
    }
    // Direct doctor request: Arjun Patel / Dermatology / Skin
    else if (
      userQuery.includes("arjun") ||
      userQuery.includes("patel") ||
      userQuery.includes("skin") ||
      userQuery.includes("rash") ||
      userQuery.includes("derma") ||
      userQuery.includes("acne") ||
      userQuery.includes("allergy") ||
      userQuery.includes("itching") ||
      userQuery.includes("eczema") ||
      userQuery.includes("psoriasis") ||
      userQuery.includes("hair") ||
      userQuery.includes("dandruff") ||
      userQuery.includes("scalp") ||
      userQuery.includes("pigmentation")
    ) {
      category = "dermatology";
      recommendedDoctor = dermaDoctor;
      reply = `🌿 **Dermatology & Skin Care Recommendation**\n\nFor skin conditions, rashes, allergies, acne, or hair health, our specialist **${dermaDoctor.name}** provides expert clinical dermatology care.\n\n**Specialist Details:**\n• **Specialization:** ${dermaDoctor.specialization}\n• **Key Expertise:** Contact dermatitis, chronic rash therapy, severe acne treatment, hair & scalp disorders\n• **OPD Availability:** Monday to Saturday, 10:00 AM - 6:00 PM\n\n**Preliminary Care Tips:**\n• Do not scratch the affected area to avoid secondary infection.\n• Wash with mild, fragrance-free lukewarm water; avoid harsh soaps.\n• Avoid applying unverified home steroid creams before clinical examination.`;
      suggestedActions = [
        { label: `Book Appointment with ${dermaDoctor.name}`, action: "book_doctor", doctorId: dermaDoctor._id, doctorName: dermaDoctor.name, specialization: dermaDoctor.specialization },
        { label: "Skin Allergy Advice", action: "learn_more" },
      ];
    }
    // Direct doctor request: Rahul Sharma / General Medicine
    else if (
      userQuery.includes("rahul") ||
      userQuery.includes("fever") ||
      userQuery.includes("cold") ||
      userQuery.includes("cough") ||
      userQuery.includes("headache") ||
      userQuery.includes("body pain") ||
      userQuery.includes("weakness") ||
      userQuery.includes("infection") ||
      userQuery.includes("flu") ||
      userQuery.includes("stomach") ||
      userQuery.includes("diabetes") ||
      userQuery.includes("general")
    ) {
      category = "general_medicine";
      recommendedDoctor = generalDoctor;
      reply = `🩺 **General Medicine & Physician Recommendation**\n\nFor fever, infectious symptoms, general fatigue, digestion, and chronic disease management, we recommend **${generalDoctor.name}**, our Senior General Physician.\n\n**Specialist Details:**\n• **Specialization:** ${generalDoctor.specialization}\n• **Key Expertise:** Fever triage, infectious disease protocol, seasonal flu, diabetic management\n• **OPD Availability:** Monday to Saturday, 8:30 AM - 4:30 PM\n\n**Supportive Care Tips:**\n• Stay well hydrated with water, oral rehydration solutions, and warm broths.\n• Maintain adequate bed rest and monitor your body temperature.\n• Avoid self-medicating with antibiotics without a prescription.`;
      suggestedActions = [
        { label: `Book Appointment with ${generalDoctor.name}`, action: "book_doctor", doctorId: generalDoctor._id, doctorName: generalDoctor.name, specialization: generalDoctor.specialization },
        { label: "Blood Test / Diagnostic Check", action: "service_info", service: "Blood Test" },
      ];
    }
    // OPD / Hospital timings inquiry
    else if (
      userQuery.includes("time") ||
      userQuery.includes("timing") ||
      userQuery.includes("hour") ||
      userQuery.includes("address") ||
      userQuery.includes("location") ||
      userQuery.includes("visit")
    ) {
      reply = `🏥 **Rekha Hospital Timings & Information**\n\n• **Emergency & ICU:** Open 24 Hours, 7 Days a week\n• **Outpatient Department (OPD):** 8:30 AM – 7:00 PM (Monday to Saturday)\n• **Pharmacy & Diagnostics Lab:** 24/7 Continuous Service\n• **Doctors on Duty:**\n  - **${cardioDoctor.name}** (Cardiology): Mon–Sat, 9 AM – 5 PM\n  - **${dermaDoctor.name}** (Dermatology): Mon–Sat, 10 AM – 6 PM\n  - **${generalDoctor.name}** (General Physician): Mon–Sat, 8:30 AM – 4:30 PM\n\nYou can book an appointment with any of our doctors online in seconds!`;
      suggestedActions = [
        { label: `Book with ${cardioDoctor.name}`, action: "book_doctor", doctorId: cardioDoctor._id, doctorName: cardioDoctor.name },
        { label: `Book with ${dermaDoctor.name}`, action: "book_doctor", doctorId: dermaDoctor._id, doctorName: dermaDoctor.name },
        { label: `Book with ${generalDoctor.name}`, action: "book_doctor", doctorId: generalDoctor._id, doctorName: generalDoctor.name },
      ];
    }
    // Doctors overview inquiry
    else if (
      userQuery.includes("doctor") ||
      userQuery.includes("specialist") ||
      userQuery.includes("who is")
    ) {
      reply = `👨‍⚕️ **Specialists Available at Rekha Hospital**\n\nWe have experienced medical professionals ready to assist you:\n\n1. **${cardioDoctor.name}** — *${cardioDoctor.specialization}*\n   Expert in heart health, ECG evaluation, hypertension, and preventive cardiology.\n\n2. **${dermaDoctor.name}** — *${dermaDoctor.specialization}*\n   Expert in skin care, rashes, chronic allergies, acne, and hair treatments.\n\n3. **${generalDoctor.name}** — *${generalDoctor.specialization}*\n   Expert in general medicine, fever, viral infections, and family health.\n\nWhich doctor would you like to schedule an appointment with?`;
      suggestedActions = [
        { label: `Book ${cardioDoctor.name} (Cardiology)`, action: "book_doctor", doctorId: cardioDoctor._id, doctorName: cardioDoctor.name },
        { label: `Book ${dermaDoctor.name} (Dermatology)`, action: "book_doctor", doctorId: dermaDoctor._id, doctorName: dermaDoctor.name },
        { label: `Book ${generalDoctor.name} (General)`, action: "book_doctor", doctorId: generalDoctor._id, doctorName: generalDoctor.name },
      ];
    }
    // General greeting or fallback inquiry
    else {
      reply = `Hello! 👋 I am the **Rekha Hospital AI Healthcare Assistant**.\n\nI can help you with:\n• **Symptom Assessment:** Tell me what symptoms you or your loved ones are experiencing.\n• **Specialist Recommendations:** I will match your condition to the right doctor:\n  - **${cardioDoctor.name}** (${cardioDoctor.specialization})\n  - **${dermaDoctor.name}** (${dermaDoctor.specialization})\n  - **${generalDoctor.name}** (${generalDoctor.specialization})\n• **Direct Online Appointment Booking:** Select your doctor and schedule a consultation right away.\n• **24/7 Emergency & Hospital Info.**\n\nHow may I assist your health journey today?`;
      suggestedActions = [
        { label: `Consult ${cardioDoctor.name} (Heart)`, action: "book_doctor", doctorId: cardioDoctor._id, doctorName: cardioDoctor.name },
        { label: `Consult ${dermaDoctor.name} (Skin)`, action: "book_doctor", doctorId: dermaDoctor._id, doctorName: dermaDoctor.name },
        { label: `Consult ${generalDoctor.name} (General)`, action: "book_doctor", doctorId: generalDoctor._id, doctorName: generalDoctor.name },
      ];
    }

    return res.status(200).json({
      success: true,
      reply,
      category,
      isEmergency,
      recommendedDoctor: recommendedDoctor
        ? {
            id: recommendedDoctor._id,
            name: recommendedDoctor.name,
            specialization: recommendedDoctor.specialization,
            phone: recommendedDoctor.phone,
          }
        : null,
      suggestedActions,
      disclaimer:
        "Rekha Hospital AI Healthcare Assistant provides supportive medical information and appointment routing. For life-threatening emergencies, call 108 or our 24/7 Emergency room immediately.",
    });
  } catch (error) {
    console.error("AI Healthcare Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process AI healthcare request. Please try again.",
    });
  }
};
