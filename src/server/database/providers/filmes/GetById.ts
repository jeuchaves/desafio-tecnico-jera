import { Api } from '../../../shared/services';
import { IFilme } from '../../models';

export const getById = async (id: number): Promise<IFilme | Error> => {
    try {
        const urlRelativa = `/movie/${id}?language=pt-br`;
        const { data } = await Api.get(urlRelativa);
        if (data) return data as IFilme;
        return new Error('Erro ao listar o registro');
    } catch (error) {
        console.log(error);
        return new Error('Erro ao listar o registro');
    }
};
