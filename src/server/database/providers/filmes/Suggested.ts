import { Api } from '../../../shared/services';
import { IFilme } from '../../models';
import { WatchListProvider } from '../watchlist';

interface ISearchData {
    results: IFilme[];
    total_pages: number;
    total_results: number;
    page: number;
}

export const suggested = async (
    perfilId: number,
    page: number
): Promise<ISearchData | Error> => {
    try {
        const filmesParaAssistir = await WatchListProvider.getAll(10, perfilId);

        if (filmesParaAssistir instanceof Error) {
            return new Error('Não foi possível localizar sua lista de filmes');
        }

        if (filmesParaAssistir.length === 0) {
            return {
                results: [],
                total_pages: 0,
                total_results: 0,
                page: 1,
            } as ISearchData;
        }

        const indiceAleatorio = Math.floor(
            Math.random() * filmesParaAssistir.length
        );
        const filmeId = filmesParaAssistir[indiceAleatorio].filmeId;

        const urlRelativa = `/movie/${filmeId}/recommendations?language=pt-br&page=${page}`;
        const { data } = await Api.get(urlRelativa);
        if (data) {
            return data as ISearchData;
        }
        return new Error('Erro ao listar os registros');
    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};
