import mongoose from 'mongoose';
const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['youtube', 'tweet', 'document', 'link'],
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
});
export const Content = mongoose.model('Content', contentSchema);
