import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Filmes - Search', () => {
    let accessToken = '';
    beforeAll(async () => {
        const email = 'search-filmes@gmail.com';
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

    it('Buscar todos os registros', async () => {
        const resBuscada = await testServer
            .get('/filmes?filter=crepusculo&page=1')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();

        expect(Number(resBuscada.header['x-total-count'])).toBeGreaterThan(0);
        expect(resBuscada.statusCode).toEqual(StatusCodes.OK);
        expect(resBuscada.body.length).toBeGreaterThan(0);
    });

    it('Tenta buscar todos os registros não estando autenticado', async () => {
        const resBuscada = await testServer.get('/filmes').send();

        expect(resBuscada.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resBuscada.body).toHaveProperty('errors.default');
    });
});
