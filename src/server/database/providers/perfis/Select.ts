import { ETableNames } from '../../ETableNames';
import { Knex } from '../../knex';

export const select = async (
    uid: number,
    perfilId: number
): Promise<void | Error> => {
    try {
        const [{ count }] = await Knex(ETableNames.perfil)
            .where('usuarioId', '=', uid)
            .andWhere('id', '=', perfilId)
            .count<[{ count: number }]>('* as count');

        if (count === 0) {
            return new Error(
                'Nenhum perfil encontrado para seu usuário com esse ID'
            );
        }
    } catch (error) {
        console.log(error);
        return Error('Erro ao selecionar o perfil');
    }
};
