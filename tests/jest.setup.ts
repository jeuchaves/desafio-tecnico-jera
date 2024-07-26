import supertest from 'supertest';
import 'dotenv/config';

import { Knex } from '../src/server/database/knex';
import { server } from '../src/server/Server';
import { sessionConfig } from '../src/server/shared/services';

beforeAll(async () => {
    await Knex.migrate.latest();
    await Knex.seed.run();

    server.use(sessionConfig);
});
afterAll(async () => {
    await Knex.destroy();
});

export const testServer = supertest(server);
