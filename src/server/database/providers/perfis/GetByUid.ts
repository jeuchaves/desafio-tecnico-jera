import { ETableNames } from '../../ETableNames';
import { IPerfil } from '../../models';
import { Knex } from '../../knex';

export const getByUid = async (uid: number): Promise<IPerfil[] | Error> => {
    try {
        const result = await Knex(ETableNames.perfil)
            .select('*')
            .where('usuarioId', '=', uid);
        return result;
    } catch (error) {
        console.log(error);
        return new Error('Erro ao consultar o registro');
    }
};
