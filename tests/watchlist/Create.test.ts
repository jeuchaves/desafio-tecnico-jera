import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('WatchList - Create', () => {
    let accessToken = '';
    beforeAll(async () => {
        const email = 'create-watchlist@gmail.com';
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

    beforeAll(async () => {
        const resPerfil = await testServer
            .post('/perfis')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ nome: 'Teste2' });
        const perfilId = resPerfil.body;

        await testServer
            .post('/perfis/selecionar')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ perfilId });
    });

    it('Cria registro', async () => {
        const res1 = await testServer
            .post('/filmes/para-assistir')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ filmeId: '1' });
        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');
    });

    it('Cria registro 2', async () => {
        const res1 = await testServer
            .post('/filmes/para-assistir')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ filmeId: '2' });
        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');
    });

    it('Tenta criar registro com perfil e filme iguais', async () => {
        const res1 = await testServer
            .post('/filmes/para-assistir')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ filmeId: '2' });
        expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res1.body).toHaveProperty('errors.default');
    });

    it('Tenta criar registro sem informar nada', async () => {
        const res1 = await testServer
            .post('/filmes/para-assistir')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.filmeId');
    });

    it('Tenta criar registro não estando autenticado', async () => {
        const res1 = await testServer
            .post('/filmes/para-assistir')
            .send({ filmeId: '4' });
        expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(res1.body).toHaveProperty('errors.default');
    });
});
