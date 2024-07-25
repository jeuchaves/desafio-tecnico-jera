import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';
import { IPerfil } from '../../models';

export const create = async (
    uid: number,
    perfil: Omit<IPerfil, 'id' | 'usuarioId'>
): Promise<number | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.perfil)
            .where('usuarioId', '=', uid)
            .count<[{ count: number }]>('* as count');

        if (count >= 4) {
            return new Error('Você pode ter no máximo 4 perfis');
        }

        const [result] = await Knex(ETableNames.perfil)
            .insert({ ...perfil, usuarioId: uid })
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
