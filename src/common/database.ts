import { MongoClient } from 'mongodb';
import { database as databaseConfig } from '@app/common/config';

export const client = new MongoClient(databaseConfig.uri);
