import { ICidade, IFilme, IPerfil, IPessoa, IUsuario } from '../../models';

declare module 'knex/types/tables' {
    interface Tables {
        cidade: ICidade;
        pessoa: IPessoa;
        usuario: IUsuario;
        perfil: IPerfil;
        filme: IFilme;
    }
}
