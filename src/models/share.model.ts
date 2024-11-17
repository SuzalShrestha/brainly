import mongoose from 'mongoose';
export const shareSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
});
export const Share = mongoose.model('Share', shareSchema);
