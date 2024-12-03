import app from './app';
import { connectDB, disconnectDB } from './db';
import logger from './utils/logger';

const PORT = process.env.PORT || 3001;
let server: any;

(async () => {
    try {
        await connectDB();
        server = app.listen(PORT, () => {
            logger.info(`Server is running at http://localhost:${PORT}`);
        });
        // Graceful shutdown handlers
        const gracefulShutdown = async (signal: string) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);
            // Close Express server
            server.close(() => {
                logger.info('HTTP server closed');
            });
            try {
                // Disconnect from MongoDB
                await disconnectDB();
                logger.info('MongoDB connection closed');
                // Exit process
                process.exit(0);
            } catch (error) {
                logger.error('Error during graceful shutdown:', error);
                process.exit(1);
            }
        };
        // Handle SIGTERM
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        // Handle SIGINT
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
})();
export default app;
