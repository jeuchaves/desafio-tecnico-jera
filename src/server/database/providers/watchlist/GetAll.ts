import { ETableNames } from '../../ETableNames';
import { IWatchList } from '../../models';
import { Knex } from '../../knex';

export const getAll = async (
    limit: number,
    perfilId: number
): Promise<IWatchList[] | Error> => {
    try {
        const result = await Knex(ETableNames.watchlist)
            .select('*')
            .where('perfilId', '=', perfilId)
            .limit(limit);

        return result;
    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar os registros');
    }
};
