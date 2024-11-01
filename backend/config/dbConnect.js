import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const dbConnect = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}`)
        console.log(`Database connected`);
        console.log(`DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('Database connection failed ', error.message);
        process.exit(1);
    }
}

export default dbConnect