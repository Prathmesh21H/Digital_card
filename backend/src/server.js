import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import userRoutes from "./routes/userRoute.js";
import subscriptionRoutes from "./routes/subscriptionRoute.js";
import cardRoutes from "./routes/cardRoute.js";
import recentlyScannedRoutes from "./routes/recentlyScannedRoutes.js";

const app = express();

// ✅ MUST be global
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["https://digital-card-9pov.onrender.com"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/recently-scanned", recentlyScannedRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
