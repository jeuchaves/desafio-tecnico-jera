import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('WatchList - GetAll', () => {
    let accessToken = '';
    beforeAll(async () => {
        const email = 'getall-watchlist@gmail.com';
        const senha = '123456';
        const dataNascimento = '1980-06-12';
        await testServer
            .post('/cadastrar')
            .send({ nome: 'Teste', email, senha, dataNascimento });
        const signInRes = await testServer
            .post('/entrar')
            .send({ email, senha });
        accessToken = signInRes.body.accessToken;
    });

    let perfilId: number;
    beforeAll(async () => {
        const resPerfil = await testServer
            .post('/perfis')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ nome: 'Teste2' });
        perfilId = resPerfil.body;
    });

    it('Buscar todos os registros', async () => {
        const res1 = await testServer
            .post(`/filmes/${perfilId}/para-assistir/2`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resBuscada = await testServer
            .get(`/filmes/${perfilId}/para-assistir`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();

        expect(Number(resBuscada.header['x-total-count'])).toBeGreaterThan(0);
        expect(resBuscada.statusCode).toEqual(StatusCodes.OK);
        expect(resBuscada.body.length).toBeGreaterThan(0);
    });

    it('Tenta buscar todos os registros não estando autenticado', async () => {
        const res1 = await testServer
            .post(`/filmes/${perfilId}/para-assistir/14`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resBuscada = await testServer
            .get(`/filmes/${perfilId}/para-assistir`)
            .send();

        expect(resBuscada.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resBuscada.body).toHaveProperty('errors.default');
    });
});
