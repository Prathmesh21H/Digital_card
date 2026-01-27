import { RecentlyScannedModel } from "../models/recentlyScannedModel.js";
import { SubscriptionModel } from "../models/subscriptionModel.js";
import { CardModel } from "../models/cardModel.js";

/**
 * Save scanned card
 */
export const saveScannedCard = async (req, res) => {
  const { cardLink, email } = req.body;

  // Check if card exists
  const card = await CardModel.findByLink(cardLink);
  if (!card) return res.status(404).json({ message: "Card not found" });

  // Registered user
  if (req.user?.uid) {
    const uid = req.user.uid;

    // Get subscription
    const subscription = await SubscriptionModel.findByUid(uid);
    const maxLimit =
      subscription?.plan === "FREE"
        ? 10
        : subscription?.plan === "PRO"
        ? 50
        : "unlimited";

    const scannedCards = await RecentlyScannedModel.add(
      uid,
      cardLink,
      maxLimit
    );
    return res.json({ saved: true, scannedCards });
  }

  // Non-registered user → prompt signup
  return res.status(403).json({
    saved: false,
    message: "Sign up to save recently scanned cards",
  });
};

/**
 * Get recently scanned cards for logged-in user
 */
export const getRecentlyScannedCards = async (req, res) => {
  const uid = req.user?.uid;
  const { cardLink } = req.query; // optional query param for public access

  // If a cardLink is provided, return that card for anyone
  if (cardLink) {
    const card = await CardModel.findByLink(cardLink);
    if (!card) return res.status(404).json({ message: "Card not found" });

    return res.json({
      card,
      message: uid
        ? "Registered user can save this card"
        : "Sign up to save this card",
    });
  }

  // Registered user: return their saved recently scanned cards
  if (uid) {
    const scannedCards = await RecentlyScannedModel.get(uid);
    return res.json({ scannedCards });
  }

  // Non-registered user without cardLink: return empty + signup prompt
  return res.json({
    scannedCards: [],
    message: "Sign up to save and view recently scanned cards",
  });
};
/**
 * Delete a specific saved card for the logged-in user
 */
export const deleteScannedCard = async (req, res) => {
  const { cardLink } = req.body; // or req.params if using /delete/:cardLink
  const uid = req.user?.uid;

  if (!uid) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    // Assuming RecentlyScannedModel has a 'remove' or 'delete' method
    const result = await RecentlyScannedModel.remove(uid, cardLink);

    if (result) {
      return res.json({
        success: true,
        message: "Card removed from recently scanned history",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Card not found in your history",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting card",
      error: error.message,
    });
  }
};
