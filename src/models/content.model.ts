import mongoose from 'mongoose';
export const contentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            enum: ['video', 'tweet', 'document', 'link'],
            required: true,
        },
        tags: {
            type: [String],
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
        isShared: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);
export const Content = mongoose.model('Content', contentSchema);
