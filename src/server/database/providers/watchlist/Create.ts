import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IWatchList } from '../../models';

export const create = async (
    watchlist: Omit<IWatchList, 'id'>
): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.perfil)
            .where('id', '=', watchlist.perfilId)
            .count<[{ count: number }]>('* as count');

        if (count === 0) {
            return new Error('O perfil usado no cadastro não foi encontrado');
        }

        const [result] = await Knex(ETableNames.watchlist)
            .insert(watchlist)
            .returning('id');
        if (typeof result === 'object') {
            return result.id;
        } else if (typeof result === 'number') {
            return result;
        }
        return new Error('Erro ao cadastrar o registro');
    } catch (error) {
        console.log(error);
        return Error('Erro ao cadastrar o registro');
    }
};
