import { Document } from 'mongoose';
import { UserType } from '../schemas';

declare global {
    namespace Express {
        interface Request {
            user: Document & UserType;
        }
    }
}

export {};
