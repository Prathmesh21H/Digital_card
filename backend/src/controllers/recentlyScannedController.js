import { RecentlyScannedModel } from "../models/recentlyScannedModel.js";
import { SubscriptionModel } from "../models/subscriptionModel.js";
import { CardModel } from "../models/cardModel.js";

/**
 * Save scanned card (AUTH REQUIRED)
 */
export const saveScannedCard = async (req, res) => {
  try {
    const { cardLink } = req.body;

    if (!cardLink) {
      return res.status(400).json({ message: "cardLink is required" });
    }

    const card = await CardModel.findByLink(cardLink);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const uid = req.user.uid;

    const subscription = await SubscriptionModel.findByUid(uid);
    const maxLimit =
      subscription?.plan === "FREE"
        ? 10
        : subscription?.plan === "PRO"
        ? 50
        : Infinity;

    const scannedCards = await RecentlyScannedModel.add(
      uid,
      cardLink,
      maxLimit
    );

    return res.json({
      saved: true,
      scannedCards,
    });
  } catch (err) {
    console.error("Save Scanned Card Error:", err);
    return res.status(500).json({
      message: "Failed to save scanned card",
    });
  }
};

/**
 * Get recently scanned cards
 */
export const getRecentlyScannedCards = async (req, res) => {
  try {
    const uid = req.user.uid;
    const scannedCards = await RecentlyScannedModel.get(uid);
    return res.json({ scannedCards });
  } catch (err) {
    console.error("Get Recently Scanned Error:", err);
    res.status(500).json({ message: "Failed to fetch scanned cards" });
  }
};
