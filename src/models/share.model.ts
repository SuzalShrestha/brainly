import { Schema, model } from 'mongoose';
interface IShare extends Document {
    user: Schema.Types.ObjectId;
    hash: string;
}
export const shareSchema = new Schema<IShare>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
});
export const Share = model<IShare>('Share', shareSchema);
