import mongoose from "mongoose";

const connectDB = async () => {
    try{
        // MONGO_URI ko primary choice banao, DATABASE_URL ko fallback
        const connectionString = process.env.MONGO_URI || process.env.DATABASE_URL; // <-- FIX
        
        await mongoose.connect(connectionString); 
        console.log("MongoDB connected successfully");
    }
    catch(error){
        console.log(`Error: ${error.name} - ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;