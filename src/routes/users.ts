import type { Request, Response } from 'express';
import { Users } from '../models/user';

export const get = async (_request: Request, response: Response) => {
    const users = await Users.find().toArray();
    return response.render('users', { users });
};
