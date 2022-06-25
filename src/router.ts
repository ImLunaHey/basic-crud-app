import createRouter from 'express-promise-router';
import { client } from '@app/common/database';
import { NextFunction, Request, Response } from 'express';
import { logger } from './common/logger';
import { ObjectId } from 'mongodb';
import { getNames } from 'country-list';
import { HttpError } from './common/http-error';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, UNPROCESSABLE_ENTITY } from 'readable-http-codes';
import { User } from './models/user';

export const router = createRouter();

// Get the users database collection
const Users = client.db('my-app').collection<User>('users');

// Home page
router.get('/', async (_request, response) => {
    return response.render('home');
});

// Users list
router.get('/users', async (_request, response) => {
    const users = await Users.find().toArray();
    return response.render('users', { users });
});

// Add a new user
router.get('/users/add', async (_request, response) => {
    return response.render('users/add', { countries: getNames() });
});
router.post('/users/add', async (request, response) => {
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
});

// Edit a user
router.get('/user/:id', async (request, response) => {
    // Make sure we have an ID
    if (!request.params.id) throw new HttpError(UNPROCESSABLE_ENTITY, 'Missing ID param');

    // Make sure the ID is at max 24 chars
    if (request.params.id.length !== 24) throw new HttpError(UNPROCESSABLE_ENTITY, 'A user ID must be 24 characters long.');

    // Add the user to the database
    const user = await Users.findOne({ _id: new ObjectId(request.params.id) }) as User;

    // Check if we found a user to edit
    if (!user) throw new HttpError(NOT_FOUND, 'No user found');

    // Render the user edit page
    return response.render('users/edit', { user, countries: getNames() });
});
router.post('/user/:id', async (request, response) => {
    // Make sure we have an ID
    if (!request.params.id) throw new HttpError(UNPROCESSABLE_ENTITY, 'Missing ID param');

    // Get the user details from the request body and validate it
    const data = await User.parseAsync(request.body);

    // Update the user in the database
    await Users.updateOne({ _id: new ObjectId(request.params.id) }, { $set: data }, { upsert: true });

    // Redirect back to the main users page
    return response.redirect('/users');
});

// Delete a user
router.get('/user/:id/delete', async (request, response) => {
    // Make sure we have an ID
    if (!request.params.id) throw new HttpError(UNPROCESSABLE_ENTITY, 'Missing ID param');

    // Make sure the ID is at max 24 chars
    if (request.params.id.length !== 24) throw new HttpError(UNPROCESSABLE_ENTITY, 'A user ID must be 24 characters long.');

    // Add the user to the database
    const user = await Users.findOne({ _id: new ObjectId(request.params.id) }) as User;

    // Check if we found a user to edit
    if (!user) throw new HttpError(NOT_FOUND, 'No user found');

    // Render the user edit page
    return response.render('users/delete', { user });
});
router.post('/user/:id/delete', async (request, response) => {
    // Make sure we have an ID
    if (!request.params.id) throw new HttpError(UNPROCESSABLE_ENTITY, 'Missing ID param');

    // Delete the user from the database
    await Users.deleteOne({ _id: new ObjectId(request.params.id) });

    // Redirect back to the main users page
    return response.redirect('/users');
});

// 404 page
router.use((_request: Request, response: Response, _next: NextFunction) => {
    response.status(404).render('errors/404', { error: new HttpError(NOT_FOUND, 'Page not found') });
});

// Error page
router.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
    logger.error(error);
    return response.status(500).render('errors/generic', { error: error instanceof HttpError ? error : new HttpError(INTERNAL_SERVER_ERROR, 'Internal Server Error') });
});