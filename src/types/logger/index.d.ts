import { Logger } from 'winston';

declare global {
    interface CustomLogger extends Logger {
        http: (message: string, metadata?: any) => void;
    }
}

export {};
