import express from 'express';

import { sessionConfig } from './shared/services';
import './shared/services/TranslationsYup';
import { router } from './routes';

declare module 'express-session' {
    interface SessionData {
        perfilId: number;
    }
}
const server = express();

server.use(sessionConfig);
server.use(express.json());
server.use(router);

export { server };
