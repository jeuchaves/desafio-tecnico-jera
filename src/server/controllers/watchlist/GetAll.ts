import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { number, object } from 'yup';

import { validation } from '../../shared/middleware';
import { WatchListProvider } from '../../database/providers';

interface IQueryProps {
    limit?: number;
}

export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(
        object({
            limit: number().moreThan(0),
        })
    ),
}));

export const getAll = async (
    req: Request<{}, {}, {}, IQueryProps>,
    res: Response
) => {
    const perfilId = req.session.perfilId;
    if (!perfilId) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ errors: { default: 'Perfil não encontrado' } });
    }

    const result = await WatchListProvider.getAll(
        req.query.limit || 10,
        perfilId
    );
    const count = await WatchListProvider.count(perfilId);

    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(result.message);
    } else if (count instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(count.message);
    }

    res.setHeader('access-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', count);

    return res.status(StatusCodes.OK).json(result);
};
