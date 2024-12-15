import { Schema, model } from 'mongoose';
interface IContent extends Document {
    title: string;
    link: string;
    type: string;
    tags: string[];
    user: Schema.Types.ObjectId;
    content: string;
    isFavorite: boolean;
    isShared: boolean;
}

export const contentSchema = new Schema<IContent>(
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
            type: Schema.Types.ObjectId,
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
contentSchema.index({ title: 'text', content: 'text', link: 'text' });
export const Content = model<IContent>('Content', contentSchema);
