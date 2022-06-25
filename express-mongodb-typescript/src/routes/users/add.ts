import { getNames } from 'country-list';
import { Request, Response } from 'express';
import { logger } from '../../common/logger';
import { Users } from '../../models/user';
import { User } from '../../types/user';

export const get = async (_request: Request, response: Response) => response.render('users/add', { countries: getNames() });

export const post = async (request: Request, response: Response) => {
    try {
        // Get the user details from the request body and validate it
        const data = await User.parseAsync(request.body);

        // Add the user to the database
        await Users.insertOne(data);

        // Redirect back to the main users page
        return response.redirect('/users');
    } catch (error: unknown) {
        if (!(error instanceof Error)) throw new Error(`Unknown Error "${error as string}"`);
        const errorMessage = 'Failed adding new user';
        logger.error(errorMessage, error);
        throw new Error(errorMessage);
    }
};
