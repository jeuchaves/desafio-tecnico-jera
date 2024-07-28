import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { FilmesProvider } from '../filmes';

export const create = async (
    perfilId: number,
    filmeId: number
): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.perfil)
            .where('id', '=', perfilId)
            .count<[{ count: number }]>('* as count');

        if (count === 0) {
            return new Error('O perfil usado no cadastro não foi encontrado');
        }

        const resultFilme = await FilmesProvider.getById(filmeId);
        if (resultFilme instanceof Error) {
            console.error(resultFilme.message);
            return new Error('O filme com esse id não foi encontrado');
        }

        const [result] = await Knex(ETableNames.watchlist)
            .insert({ filmeId, perfilId })
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
