import { test, expect } from 'vitest';

test('has a debug, info, warn and error level', async () => {
    const { logger } = await import('@app/common/logger');
    expect(Object.keys(logger)).toStrictEqual(['debug', 'info', 'warn', 'error']);
});
