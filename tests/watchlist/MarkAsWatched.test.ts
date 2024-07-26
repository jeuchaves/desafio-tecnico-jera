import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('WatchList - MarkAsWatched', () => {
    let accessToken = '';
    beforeAll(async () => {
        const email = 'updatebyid-cidades@gmail.com';
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

    let cookie: string;
    beforeAll(async () => {
        const resPerfil = await testServer
            .post('/perfis')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ nome: 'Teste2' });
        const perfilId = resPerfil.body;

        const resSelectPerfil = await testServer
            .post('/perfis/selecionar')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ perfilId });

        cookie = resSelectPerfil.headers['set-cookie'];
    });

    it('Marca registro como assistido', async () => {
        const res1 = await testServer
            .post('/filmes/para-assistir')
            .set({ Authorization: `Bearer ${accessToken}` })
            .set({ Cookie: cookie })
            .send({ filmeId: '1' });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resAssistido = await testServer
            .patch(`/filmes/para-assistir/${res1.body}/assistido`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .set({ Cookie: cookie })
            .send();

        expect(resAssistido.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    it('Tenta marcar registro que não existe como assistido', async () => {
        const resAssistido = await testServer
            .patch('/filmes/para-assistir/999/assistido')
            .set({ Authorization: `Bearer ${accessToken}` })
            .set({ Cookie: cookie })
            .send();

        expect(resAssistido.statusCode).toEqual(
            StatusCodes.INTERNAL_SERVER_ERROR
        );
        expect(resAssistido.body).toHaveProperty('errors.default');
    });

    it('Tenta marcar registro sem perfil selecionado', async () => {
        const res1 = await testServer
            .post('/filmes/para-assistir')
            .set({ Authorization: `Bearer ${accessToken}` })
            .set({ Cookie: cookie })
            .send({ filmeId: '2' });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resAssistido = await testServer
            .patch(`/filmes/para-assistir/${res1.body}/assistido`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();

        expect(resAssistido.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(resAssistido.body).toHaveProperty('errors.default');
    });

    it('Tenta marcar registro não estando autenticado', async () => {
        const res1 = await testServer
            .post('/filmes/para-assistir')
            .set({ Authorization: `Bearer ${accessToken}` })
            .set({ Cookie: cookie })
            .send({ filmeId: '3' });

        expect(res1.statusCode).toEqual(StatusCodes.CREATED);

        const resAssistido = await testServer
            .patch(`/filmes/para-assistir/${res1.body}/assistido`)
            .set({ Cookie: cookie })
            .send();

        expect(resAssistido.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(resAssistido.body).toHaveProperty('errors.default');
    });
});
