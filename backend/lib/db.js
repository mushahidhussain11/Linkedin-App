import mongoose from "mongoose";

export const connectToDB = async ()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${connect.connection.host}`)
    }catch (error) {
        console.error(`Error connecting to mongo db ${error.message}`)
        process.exit(1)
    }
}