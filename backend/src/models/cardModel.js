import admin from "../config/firebaseAdmin.js";
import { v4 as uuid } from "uuid";

const db = admin.firestore();
const COLLECTION = "cards";

export const CardModel = {
  async create(uid, data) {
    const cardId = uuid();
    const cardLink = `card/${cardId}`;

    await db
      .collection(COLLECTION)
      .doc(cardId)
      .set({
        cardId,
        ownerUid: uid,
        cardLink,
        views: 0,
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return { cardId, cardLink };
  },

  async findById(cardId) {
    const doc = await db.collection(COLLECTION).doc(cardId).get();
    return doc.exists ? doc.data() : null;
  },

  async findByOwner(uid) {
    const snap = await db
      .collection(COLLECTION)
      .where("ownerUid", "==", uid)
      .get();

    return snap.docs.map((d) => d.data());
  },

  async findByLink(cardLink) {
    const snap = await db
      .collection(COLLECTION)
      .where("cardLink", "==", cardLink)
      .limit(5)
      .get();

    return snap.empty ? null : snap.docs[0].data();
  },

  async update(cardId, uid, data) {
    const ref = db.collection(COLLECTION).doc(cardId);
    const doc = await ref.get();

    if (!doc.exists || doc.data().ownerUid !== uid) return null;

    await ref.update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return true;
  },

  async delete(cardId, uid) {
    const ref = db.collection(COLLECTION).doc(cardId);
    const doc = await ref.get();

    if (!doc.exists || doc.data().ownerUid !== uid) return false;

    await ref.delete();
    return true;
  },

  async incrementViews(cardId) {
    const ref = db.collection(COLLECTION).doc(cardId);

    // This works even if the 'views' field doesn't exist yet (it starts at 0)
    await ref.update({
      views: admin.firestore.FieldValue.increment(1),
    });
  },

  async findByLink(cardLink) {
    const snap = await db
      .collection(COLLECTION)
      .where("cardLink", "==", cardLink)
      .limit(1) // Changed from 5 to 1 for efficiency
      .get();

    return snap.empty ? null : snap.docs[0].data();
  },
};
