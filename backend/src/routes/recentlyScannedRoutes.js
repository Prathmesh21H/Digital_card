import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {
  saveScannedCard,
  getRecentlyScannedCards,
} from "../controllers/recentlyScannedController.js";

const router = express.Router();

router.post("/", requireAuth, saveScannedCard);
router.get("/me", requireAuth, getRecentlyScannedCards);

export default router;
