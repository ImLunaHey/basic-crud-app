import createApp, { json as parseJson, static as serveDirectory, urlencoded as parseURLEncoded } from 'express';
import getPort from 'get-port';
import { logger } from '@app/common/logger';
import { router } from '@app/router';
import { client } from '@app/common/database';

// Create our express instance
const app = createApp();

// Set the render engine to use for templates
app.set('view engine', 'ejs');

// Serve all the files in the public directory
app.use(serveDirectory('public'));

// Parse the form body of all POST requests
app.use(parseURLEncoded({ extended: true }));

// Parse the JSON body of all POST requests
app.use(parseJson());

// Add all of our routes to the express instance
app.use(router);

// Create the main application
const main = async () => {
    // Get a new port, attempt to use 9000 otherwise get a random port
    const port = await getPort({
        port: 7500
    });

    // Connect to database
    await client.connect();
    logger.debug('Connected to database');

    // Start the web server
    app.listen(port, () => {
        logger.debug(`Webserver started at http://localhost:${port}`);
    });
};

// Start the application
main().catch(error => {
    logger.error('Application threw an error "%s"', error);
});
