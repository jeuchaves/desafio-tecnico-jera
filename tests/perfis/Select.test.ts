import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Perfis - Create', () => {
    let accessToken = '';
    beforeAll(async () => {
        const email = 'select-perfis@gmail.com';
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

    let perfilId: number | undefined = undefined;
    beforeAll(async () => {
        const resPerfil = await testServer
            .post('/perfis')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ nome: 'TesteSelecionar' });
        perfilId = resPerfil.body;
    });

    it('Seleciona registro', async () => {
        const res1 = await testServer
            .post('/perfis/selecionar')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ perfilId });
        expect(res1.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    it('Tenta selecionar registro sem nada na requisição', async () => {
        const res1 = await testServer
            .post('/perfis/selecionar')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.perfilId');
    });

    it('Tenta selecionar registro que não existe', async () => {
        const res1 = await testServer
            .post('/perfis/selecionar')
            .set({ Authorization: `Bearer ${accessToken}` })
            .send({ perfilId: '999' });
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.default');
    });

    it('Tenta selecionar registro não estando autenticado', async () => {
        const res1 = await testServer
            .post('/perfis/selecionar')
            .send({ nome: 'Teste 3' });
        expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(res1.body).toHaveProperty('errors.default');
    });
});
