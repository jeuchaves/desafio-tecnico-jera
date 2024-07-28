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

    let perfilId: number;
    beforeAll(async () => {
        const resPerfil = await testServer
            .post('/perfis')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ nome: 'Teste2' });
        perfilId = resPerfil.body;
    });

    it('Cria registro', async () => {
        const res1 = await testServer
            .post(`/filmes/${perfilId}/para-assistir/2`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');
    });

    it('Cria registro 2', async () => {
        const res1 = await testServer
            .post(`/filmes/${perfilId}/para-assistir/5`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');
    });

    it('Tenta criar registro com perfil e filme iguais', async () => {
        const res1 = await testServer
            .post(`/filmes/${perfilId}/para-assistir/16`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const res2 = await testServer
            .post(`/filmes/${perfilId}/para-assistir/16`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res2.body).toHaveProperty('errors.default');
    });

    it('Tenta criar registro não estando autenticado', async () => {
        const res1 = await testServer
            .post(`/filmes/${perfilId}/para-assistir/5`)
            .send();
        expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(res1.body).toHaveProperty('errors.default');
    });
});
