import app from './app';
import connectDB from './db';

connectDB()
    .then(() => {
        app.listen(3000, () => console.log('Server running on port 3000'));
    })
    .catch((e) => {
        console.error(`Error: ${(e as Error).message}`);
        process.exit(1);
    });
