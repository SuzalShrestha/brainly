import app from './app';
import connectDB from './db';

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    connectDB();
});
export default app;
