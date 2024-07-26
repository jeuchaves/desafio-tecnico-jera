import {
    ICidade,
    IFilme,
    IPerfil,
    IPessoa,
    IUsuario,
    IWatchList,
} from '../../models';

declare module 'knex/types/tables' {
    interface Tables {
        cidade: ICidade;
        pessoa: IPessoa;
        usuario: IUsuario;
        perfil: IPerfil;
        filme: IFilme;
        watchList: IWatchList;
    }
}
