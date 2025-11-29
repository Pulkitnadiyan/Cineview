import express from "express";
import { chatWithAI } from "../controllers/chatController.js";
 import { authenticate } from "../middlewares/authmiddleware.js"; // Optional: agar sirf logged-in users ke liye chahiye

const router = express.Router();

router.post("/", chatWithAI);

export default router;