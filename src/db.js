import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://sdicesare:sdicesare@cluster0.aoqv4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log('DB CONNECTED');
    } catch (error) {
        console.log(error);
    }
}