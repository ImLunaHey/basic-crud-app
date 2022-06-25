import { config as loadEnvironmentVariablesFromFile } from 'dotenv';
import { logger } from '@app/common/logger';

// Load .env file into process.env
loadEnvironmentVariablesFromFile();

export const database = {
    uri: process.env.DATABASE_URI!
};

if (!database.uri) {
    logger.error('DATABASE_URI environment variable needs to be set.');
    process.exit(1);
}