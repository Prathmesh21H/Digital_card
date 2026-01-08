import axios from "axios";

/* ---------------- AXIOS INSTANCE ---------------- */

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------- AUTH TOKEN HANDLER ---------------- */

// Attach / remove token globally
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

/* ---------------- USER APIs ---------------- */

export const userAPI = {
  createOrUpdate: async (userData) => {
    const response = await API.post("api/users", userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get("api/users/me");
    return response.data;
  },
};

/* ---------------- SUBSCRIPTION APIs ---------------- */

export const subscriptionAPI = {
  // Get current subscription
  getCurrentSubscription: async () => {
    const response = await API.get("api/subscription");
    return response.data;
  },

  // Select plan
  // MUST send: { plan: "FREE" | "PRO" | "PREMIUM" }
  selectPlan: async ({ plan }) => {
    const response = await API.post("api/subscription/select", { plan });
    return response.data;
  },

  // Confirm payment (mock / real gateway)
  confirmPayment: async ({
    plan,
    paymentGateway = "demo",
    paymentId = "demo_payment",
  }) => {
    const response = await API.post("api/subscription/confirm-payment", {
      plan,
      paymentGateway,
      paymentId,
    });
    return response.data;
  },
};

/* ---------------- CARD APIs ---------------- */

export const cardAPI = {
  createCard: async (cardData) => {
    const response = await API.post("api/cards", cardData);
    return response.data;
  },

  getMyCards: async () => {
    const response = await API.get("api/cards/me");
    return response.data;
  },

  getCardById: async (cardId) => {
    const response = await API.get(`api/cards/${cardId}`);
    return response.data;
  },

  updateCard: async (cardId, updateData) => {
    const response = await API.put(`api/cards/${cardId}`, updateData);
    return response.data;
  },

  deleteCard: async (cardId) => {
    const response = await API.delete(`api/cards/${cardId}`);
    return response.data;
  },

  getPublicCard: async (cardLink) => {
    const response = await API.get(`api/cards/public/${cardLink}`);
    return response.data;
  },
};

/* ---------------- EXPORT ---------------- */

export default API;
