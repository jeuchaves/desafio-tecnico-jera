import { IFilme, IPerfil, IUsuario, IWatchList } from '../../models';

declare module 'knex/types/tables' {
    interface Tables {
        usuario: IUsuario;
        perfil: IPerfil;
        filme: IFilme;
        watchList: IWatchList;
    }
}
