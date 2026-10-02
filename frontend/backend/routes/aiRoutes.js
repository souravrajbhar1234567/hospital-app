import express from "express";
import { chatWithAi } from "../controllers/aiController.js";

const router = express.Router();

// ==========================================
// AI HEALTHCARE ASSISTANT ROUTES
// Publicly accessible for patients & visitors
// ==========================================

router.post("/chat", chatWithAi);

export default router;
