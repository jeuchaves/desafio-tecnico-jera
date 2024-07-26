import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const markAsWatched = async (id: number): Promise<void | Error> => {
    try {
        const result = await Knex(ETableNames.watchlist)
            .update({ assistido: true })
            .where('id', '=', id);

        if (result > 0) return;

        return new Error('Erro ao marcar como assistido o registro');
    } catch (error) {
        console.log(error);
        return new Error('Erro ao marcar como assistido o registro');
    }
};
