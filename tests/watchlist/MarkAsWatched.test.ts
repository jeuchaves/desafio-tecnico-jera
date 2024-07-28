import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('WatchList - MarkAsWatched', () => {
    let accessToken = '';
    beforeAll(async () => {
        const email = 'markaswatched-watchlist@gmail.com';
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

    it('Marca registro como assistido', async () => {
        const res1 = await testServer
            .post(`/filmes/${perfilId}/para-assistir/2`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resAssistido = await testServer
            .patch(`/filmes/${perfilId}/para-assistir/${res1.body}/assistido`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();

        expect(resAssistido.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    it('Tenta marcar registro que não existe como assistido', async () => {
        const resAssistido = await testServer
            .patch(`/filmes/${perfilId}/para-assistir/999/assistido`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();

        expect(resAssistido.statusCode).toEqual(
            StatusCodes.INTERNAL_SERVER_ERROR
        );
        expect(resAssistido.body).toHaveProperty('errors.default');
    });

    it('Tenta marcar registro não estando autenticado', async () => {
        const res1 = await testServer
            .post(`/filmes/${perfilId}/para-assistir/14`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resAssistido = await testServer
            .patch(`/filmes/${perfilId}/para-assistir/${res1.body}/assistido`)
            .send();

        expect(resAssistido.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resAssistido.body).toHaveProperty('errors.default');
    });
});
