import { UserType } from '../schema';

declare global {
    namespace Express {
        interface Request {
            user: UserType;
        }
    }
}

export {};
