import { getNames } from 'country-list';
import type { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { UNPROCESSABLE_ENTITY, NOT_FOUND } from 'readable-http-codes';
import { HttpError } from '../../common/http-error';
import { Users } from '../../models/user';
import { User } from '../../types/user';

export const get = async (request: Request, response: Response) => {
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
};

export const post = async (request: Request, response: Response) => {
    // Make sure we have an ID
    if (!request.params.id) throw new HttpError(UNPROCESSABLE_ENTITY, 'Missing ID param');

    // Get the user details from the request body and validate it
    const data = await User.parseAsync(request.body);

    // Update the user in the database
    await Users.updateOne({ _id: new ObjectId(request.params.id) }, { $set: data }, { upsert: true });

    // Redirect back to the main users page
    return response.redirect('/users');
};
