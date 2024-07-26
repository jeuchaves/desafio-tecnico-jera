import { Api } from '../../../shared/services';
import { IFilme } from '../../models';

interface ISearchData {
    results: IFilme[];
    total_pages: number;
    total_results: number;
    page: number;
}

export const search = async (
    page: number,
    filter: string
): Promise<ISearchData | Error> => {
    try {
        const urlRelativa = `/search/movie?query=${filter}&page=${page}`;
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
