import { Api } from '../../../shared/services';
import { IFilme } from '../../models';
import { WatchListProvider } from '../watchlist';

interface ISearchData {
    results: IFilme[];
    total_pages: number;
    total_results: number;
    page: number;
}

export const search = async (
    perfilId: number,
    page: number,
    filter: string
): Promise<ISearchData | Error> => {
    try {
        const urlRelativa = `/search/movie?query=${filter}&page=${page}&language=pt-br`;
        const { data } = await Api.get(urlRelativa);
        if (data) {
            const watchlist = await WatchListProvider.getAll(1000, perfilId);
            if (watchlist instanceof Error) {
                return data as ISearchData;
            }
            const watchlistIds = watchlist.map((item) => item.filmeId);
            const updatedResult = data.results.map((filme: IFilme) => ({
                ...filme,
                isInWatchlist: watchlistIds.includes(filme.id),
            }));
            return {
                ...data,
                results: updatedResult,
            } as ISearchData;
        }
        return new Error('Erro ao listar os registros');
    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};
