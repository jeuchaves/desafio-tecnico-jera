import { IFilme } from './Filme';

export interface IWatchList {
    id: number;
    perfilId: number;
    filmeId: number;
    assistido: boolean;
    detalhes: IFilme;
}
