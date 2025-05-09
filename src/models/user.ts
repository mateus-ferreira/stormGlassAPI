import mongoose, { Document, Model } from 'mongoose';
import AuthService from '../services/auth';

export interface User {
    _id?: string;
    name: string;
    email: string;
    password: string;
}

export enum CUSTOM_VALIDATION {
    DUPLICATED = 'DUPLICATED',
}

export interface UserModel extends Omit<User, '_id'>, Document {}

const schema = new mongoose.Schema<User>(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: { type: String, required: true },
    },
    {
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

schema.path('email').validate(
    async (email: string) => {
        const emailCount = await mongoose.models.User.countDocuments({
            email,
        });
        return !emailCount;
    },
    'already exists in the database.',
    CUSTOM_VALIDATION.DUPLICATED
);

schema.pre<UserModel>('save', async function (): Promise<void> {
    if (!this.password || !this.isModified('password')) {
        return;
    }

    try {
        this.password = await AuthService.hashPassword(this.password);
    } catch (err) {
        console.error(`Error hashing the password for the user ${this.name}`);
    }
});

export const User = mongoose.model<User>('User', schema);
