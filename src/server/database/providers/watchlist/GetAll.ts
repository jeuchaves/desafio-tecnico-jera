import { ETableNames } from '../../ETableNames';
import { IWatchList } from '../../models';
import { Knex } from '../../knex';
import { FilmesProvider } from '../filmes';

export const getAll = async (
    limit: number,
    perfilId: number
): Promise<IWatchList[] | Error> => {
    try {
        const result = await Knex(ETableNames.watchlist)
            .select('*')
            .where('perfilId', '=', perfilId)
            .limit(limit);

        const filmesDetalhesPromises = result.map((item: IWatchList) =>
            FilmesProvider.getById(item.filmeId)
        );

        const filmeDetalhesResponses = await Promise.all(
            filmesDetalhesPromises
        );

        const watchlistDetalhada = result.reduce((acc, item, index) => {
            const filmeDetalhes = filmeDetalhesResponses[index];
            if (!(filmeDetalhes instanceof Error)) {
                acc.push({
                    ...item,
                    detalhes: { ...filmeDetalhes },
                });
            }
            return acc;
        }, [] as IWatchList[]);

        return watchlistDetalhada;
    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};
