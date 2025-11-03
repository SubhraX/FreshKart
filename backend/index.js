import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ConnectDB } from "./src/lib/db.js";
import itemRoutes from './src/routes/item.route.js';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/items', itemRoutes);

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        await ConnectDB();
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();