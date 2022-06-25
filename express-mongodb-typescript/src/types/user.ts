import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const User = z.object({
    _id: z.optional(z.instanceof(ObjectId)),
    username: z.string(),
    'first-name': z.string(),
    'last-name': z.string(),
    email: z.string(),
    country: z.string(),
    'street-address': z.string(),
    city: z.string(),
    region: z.string(),
    'postal-code': z.string(),
    'roles': z.array(z.literal('admin').or(z.literal('user'))).optional().transform(roles => roles ?? []),
    status: z.literal('active').or(z.literal('inactive'))
});

export type User = z.infer<typeof User>;
