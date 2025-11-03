import mongoose from 'mongoose';

export const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
        return conn;
    } catch(error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};