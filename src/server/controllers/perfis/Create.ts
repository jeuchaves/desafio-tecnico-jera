import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { object, string } from 'yup';

import { PerfisProvider } from '../../database/providers';
import { validation } from '../../shared/middleware';
import { IPerfil } from '../../database/models';

interface IBodyProps extends Omit<IPerfil, 'id' | 'usuarioId'> {}

export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(
        object({
            nome: string()
                .required()
                .min(3)
                .matches(/^[^\s]+$/, 'Perfil deve ter somente um nome'),
        })
    ),
}));

export const create = async (
    req: Request<{}, {}, IBodyProps>,
    res: Response
) => {
    const uid = Number(req.headers.idUsuario);
    const result = await PerfisProvider.create(uid, req.body);
    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ errors: { default: result.message } });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
