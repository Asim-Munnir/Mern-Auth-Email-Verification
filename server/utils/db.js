import mongoose from "mongoose";

const connectDB = async () => {
    try {
        
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connection established");
        });

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        mongoose.connection.on("error", (err) => {
            console.log("MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });

    } catch (error) {
        console.log("MongoDB connection failed ❌:", error.message);
        process.exit(1);
    }
};

export default connectDB;