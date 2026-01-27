import { CardModel } from "../models/cardModel.js";
import { SubscriptionModel } from "../models/subscriptionModel.js";
// import { validateCardData } from "../utils/validateCardData.js";
// import { validateCardFeatures } from "../utils/cardFeatureGaurd.js";

/* -----------------------------------
   HELPER: Remove undefined values
----------------------------------- */
const cleanData = (obj) => JSON.parse(JSON.stringify(obj));

/* -----------------------------------
   CREATE DIGITAL CARD (FIXED)
----------------------------------- */
export const createCard = async (req, res) => {
  try {
    const uid = req.user.uid;

    const cardData = cleanData(req.body);
    // const validationErrors = validateCardData(cardData);
    // if (validationErrors) {
    //   return res.status(400).json({ message: "Validation failed", errors: validationErrors });
    // }

    // 1️⃣ Ensure subscription exists
    const subscription = await SubscriptionModel.findByUid(uid);
    if (!subscription) {
      return res.status(403).json({
        message: "No active subscription found",
      });
    }

    // const error = validateCardFeatures(subscription, cardData);
    // if (error) {
    //   return res.status(403).json({ message: error });
    // }

    // 3️⃣ Create card
    const card = await CardModel.create(uid, cardData);

    // 4️⃣ ATOMIC increment + limit enforcement
    // 🔥 This is the ONLY place limit is enforced
    try {
      await SubscriptionModel.incrementCardCountAtomic(uid);
    } catch (err) {
      // Rollback card if limit exceeded
      await CardModel.delete(card.cardId, uid);

      return res.status(403).json({
        message: "Card limit reached. Upgrade your plan.",
      });
    }

    return res.status(201).json(card);
  } catch (err) {
    console.error("Create Card Error:", err);
    return res.status(500).json({
      message: "Failed to create card",
    });
  }
};

/* -----------------------------------
   FETCH MY CARDS
----------------------------------- */
export const getMyCards = async (req, res) => {
  try {
    const cards = await CardModel.findByOwner(req.user.uid);
    res.json({ cards });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -----------------------------------
   FETCH CARD BY ID
----------------------------------- */
export const getCardById = async (req, res) => {
  try {
    const { cardId } = req.params;
    const uid = req.user.uid;

    const card = await CardModel.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.ownerUid !== uid) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(card);
  } catch (err) {
    console.error("Get card error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------------
   UPDATE CARD
----------------------------------- */
export const updateCard = async (req, res) => {
  try {
    const updateData = cleanData(req.body);

    const success = await CardModel.update(
      req.params.cardId,
      req.user.uid,
      updateData
    );

    if (!success) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -----------------------------------
   DELETE CARD
----------------------------------- */
export const deleteCard = async (req, res) => {
  try {
    const uid = req.user.uid;
    const cardId = req.params.cardId;

    const success = await CardModel.delete(cardId, uid);
    if (!success) {
      return res.status(404).json({ message: "Card not found" });
    }

    await SubscriptionModel.decrementCardCount(uid);

    res.json({ deleted: true });
  } catch (err) {
    console.error("Delete Card Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* -----------------------------------
   PUBLIC CARD FETCH
----------------------------------- */
export const getCardByLink = async (req, res) => {
  try {
    const cardLink = req.params[0];
    if (!cardLink) {
      return res.status(404).json({ message: "No link provided" });
    }

    // 1. Fetch the card
    const card = await CardModel.findByLink(cardLink);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    await CardModel.incrementViews(card.cardId);

    card.views = (card.views || 0) + 1;

    res.json({ card });
  } catch (err) {
    console.error("Public Fetch Error:", err);
    res.status(500).json({ message: err.message });
  }
};
