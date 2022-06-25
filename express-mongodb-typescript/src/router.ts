import createRouter from 'express-promise-router';
import { NextFunction, Request, Response } from 'express';
import { logger } from './common/logger';
import { HttpError } from './common/http-error';
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'readable-http-codes';
import * as home from './routes/home';
import * as users from './routes/users';
import * as usersAdd from './routes/users/add';
import * as userEdit from './routes/users/edit';
import * as userDelete from './routes/users/delete';

// Create an express router
export const router = createRouter();

// Home page
router.get('/', home.get);

// Users list
router.get('/users', users.get);

// Add a new user
router.get('/users/add', usersAdd.get);
router.post('/users/add', usersAdd.post);

// Edit a user
router.get('/user/:id', userEdit.get);
router.post('/user/:id', userEdit.post);

// Delete a user
router.get('/user/:id/delete', userDelete.get);
router.post('/user/:id/delete', userDelete.post);

// 404 page
router.use((_request: Request, response: Response, _next: NextFunction) => {
    response.status(404).render('errors/404', { error: new HttpError(NOT_FOUND, 'Page not found') });
});

// Error page
router.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
    logger.error(error);
    return response.status(500).render('errors/generic', { error: error instanceof HttpError ? error : new HttpError(INTERNAL_SERVER_ERROR, 'Internal Server Error') });
});