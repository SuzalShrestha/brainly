import { Request } from 'express';
import { type User } from '../../models/User';
export interface RequestWithUser extends Request {
    user?: User;
}
