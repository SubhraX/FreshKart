import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ConnectDB } from "./src/lib/db.js";
import itemRoutes from './src/routes/item.route.js';
import authRoutes from './src/routes/auth.route.js';
import paymentRoutes from './src/routes/payment.js';
import aiRoutes from "./src/routes/ai.route.js";


dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(express.json());

// Existing routes
app.use('/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/ai", aiRoutes);


// ✅ NEW: Stripe Payment Route
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    ConnectDB();
});
