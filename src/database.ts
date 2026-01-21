import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const rawUri = process.env.MONGODB_URI || "";
        if (!rawUri) {
            throw new Error("MONGODB_URI is not set");
        }

        const mongoUri = /^mongodb(\+srv)?:\/\//.test(rawUri)
            ? rawUri
            : `mongodb://${rawUri}`;

        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;