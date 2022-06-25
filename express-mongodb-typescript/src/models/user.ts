import { client } from '../common/database';
import { User } from '../types/user';

// Get the users database collection
export const Users = client.db('my-app').collection<User>('users');
