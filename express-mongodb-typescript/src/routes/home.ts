import type { Request, Response } from 'express';

export const get = async (_request: Request, response: Response) => {
    return response.render('home');
};