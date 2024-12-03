import mongoose from 'mongoose';
import logger from './utils/logger';

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI!);
        logger.info(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        logger.info('MongoDB disconnected');
    } catch (error) {
        logger.error('Error disconnecting from MongoDB:', error);
        throw error;
    }
};
