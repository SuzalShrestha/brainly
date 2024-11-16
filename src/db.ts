import mongoose from 'mongoose';
import { DB_NAME } from './constants';
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            `${process.env.MONGO_URI}/${DB_NAME}`
        );
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (e: unknown) {
        console.error(`Error: ${(e as Error).message}`);
        process.exit(1);
    }
};
export default connectDB;
