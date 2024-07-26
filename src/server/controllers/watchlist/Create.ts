import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { boolean, number, object } from 'yup';

import { WatchListProvider } from '../../database/providers';
import { validation } from '../../shared/middleware';
import { IWatchList } from '../../database/models';

interface IBodyProps extends Omit<IWatchList, 'id' | 'perfilId'> {}

export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(
        object({
            filmeId: number().integer().required(),
            assistido: boolean().default(false),
        })
    ),
}));

export const create = async (
    req: Request<{}, {}, IBodyProps>,
    res: Response
) => {
    const perfilId = req.session.perfilId;
    if (!perfilId) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ errors: { default: 'Perfil não encontrado' } });
    }
    const result = await WatchListProvider.create({ ...req.body, perfilId });
    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ errors: { default: result.message } });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
