import admin from "../config/firebaseAdmin.js";

const db = admin.firestore();
const COLLECTION = "recentlyScannedCards";

export const RecentlyScannedModel = {
  async get(uid) {
    const doc = await db.collection(COLLECTION).doc(uid).get();
    return doc.exists ? doc.data().scannedCards || [] : [];
  },

  async add(uid, cardLink, maxLimit) {
    const ref = db.collection(COLLECTION).doc(uid);
    const doc = await ref.get();
    let scannedCards = doc.exists ? doc.data().scannedCards || [] : [];

    scannedCards = scannedCards.filter((card) => card.cardLink !== cardLink);

    if (maxLimit !== "unlimited" && scannedCards.length >= maxLimit) {
      scannedCards.shift();
    }

    scannedCards.push({
      cardLink,
      scannedAt: new Date(),
    });

    await ref.set({ scannedCards }, { merge: true });
    return scannedCards;
  },

  remove: async (uid, cardLink) => {
    console.log(`Deleting card ${cardLink} for user ${uid}`);
    return true;
  },
};
