import { StatusCodes } from 'http-status-codes';
import { testServer } from '../jest.setup';

describe('Usuarios - Sign Up', () => {
    it('Cadastra usuário 1', async () => {
        const res1 = await testServer.post('/cadastrar').send({
            nome: 'joaocadastra',
            email: 'joaocadastra@teste.com',
            senha: '123456',
            dataNascimento: '1980-06-12',
        });
        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');
    });

    it('Cadastra usuário 2', async () => {
        const res1 = await testServer.post('/cadastrar').send({
            nome: 'joaocadastra2',
            email: 'joaocadastra2@teste.com',
            senha: '123456',
            dataNascimento: '1980-06-12',
        });
        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');
    });

    it('Tenta cadastrar usuário com e-mail já existente', async () => {
        const res1 = await testServer.post('/cadastrar').send({
            nome: 'joaoduplicado',
            email: 'joaoduplicado@teste.com',
            senha: '123456',
            dataNascimento: '1980-06-12',
        });
        expect(res1.statusCode).toEqual(StatusCodes.CREATED);
        expect(typeof res1.body).toEqual('number');

        const res2 = await testServer.post('/cadastrar').send({
            nome: 'joaoduplicado2',
            email: 'joaoduplicado@teste.com',
            senha: '1234567',
            dataNascimento: '1980-06-12',
        });
        expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(res2.body).toHaveProperty('errors.default');
    });

    it('Tenta cadastrar usuário com e-mail inválido', async () => {
        const res1 = await testServer.post('/cadastrar').send({
            nome: 'joaoinvalido',
            email: 'joao invalido@teste.com',
            senha: '123456',
            dataNascimento: '1980-06-12',
        });
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.email');
    });

    it('Tenta cadastrar usuário com senha inválida', async () => {
        const res1 = await testServer.post('/cadastrar').send({
            nome: 'joaoinvalido',
            email: 'joao invalido@teste.com',
            senha: '12345',
            dataNascimento: '1980-06-12',
        });
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.senha');
    });

    it('Tenta criar um registro com nome muito curto', async () => {
        const res1 = await testServer.post('/cadastrar').send({ nome: 'ca' });

        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.nome');
    });

    it('Tenta criar um registro com dataNascimento no futuro', async () => {
        const res1 = await testServer.post('/cadastrar').send({
            nome: 'joaocadastra',
            email: 'joaocadastranasceudepois@teste.com',
            senha: '123456',
            dataNascimento: '2050-06-12',
        });
        expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors.body.dataNascimento');
    });
});
