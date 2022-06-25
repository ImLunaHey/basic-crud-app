export const logger = {
    debug(message: string, ...args: any[]) {
        console.debug(message, ...args);
    },
    info(message: string, ...args: any[]) {
        console.info(message, ...args);
    },
    warn(message: string, ...args: any[]) {
        console.warn(message, ...args);
    },
    error(message: Error | string, ...args: any[]) {
        console.error(message, ...args);
    }
};
