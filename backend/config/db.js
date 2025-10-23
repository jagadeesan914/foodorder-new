import mongoose from "mongoose";

export const connectDB = async () => {
    
    const mongoUri = 'mongodb+srv://jsp695960_db_user:2233445566@cluster0.bjysnf1.mongodb.net/food-delivery-db?retryWrites=true&w=majority';

    try {
        await mongoose.connect(mongoUri);
        
        console.log("DB Connected");
    } catch (error) {
        
        console.error("DB Connection Error:", error.message);
    }
}