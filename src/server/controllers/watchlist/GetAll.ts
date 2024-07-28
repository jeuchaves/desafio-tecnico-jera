import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { number, object } from 'yup';

import { validation } from '../../shared/middleware';
import { WatchListProvider } from '../../database/providers';

interface IQueryProps {
    limit?: number;
}

interface IParamProps {
    perfilId?: number;
}

export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(
        object({
            limit: number().moreThan(0),
        })
    ),
    params: getSchema<IParamProps>(
        object({
            perfilId: number().required().integer(),
        })
    ),
}));

export const getAll = async (
    req: Request<IParamProps, {}, {}, IQueryProps>,
    res: Response
) => {
    if (!req.params.perfilId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: { default: 'O parâmetro "perfilId" precisa ser informado' },
        });
    }
    const result = await WatchListProvider.getAllWithDetails(
        req.query.limit || 10,
        req.params.perfilId
    );
    const count = await WatchListProvider.count(req.params.perfilId);

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
