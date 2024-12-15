import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Model, Schema, model } from 'mongoose';
interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    refreshToken: string;
    updatedAt: Date;
    createdAt: Date;
}
interface IUserMethods {
    generateAccessToken: () => Promise<string>;
    generateRefreshToken: () => Promise<string>;
    isPasswordCorrect: (password: string) => Promise<boolean>;
}
type UserModel = Model<IUser, {}, IUserMethods>;

export const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = async function () {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
    const accessToken = jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
    return accessToken;
};
userSchema.methods.generateRefreshToken = async function () {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined');
    }
    const refreshToken = jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
    return refreshToken;
};
export const User = model<IUser, UserModel>('User', userSchema);
