import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { number, object, string } from 'yup';

import { validation } from '../../shared/middleware';
import { FilmesProvider } from '../../database/providers';

interface IQueryProps {
    page?: number;
    filter?: string;
}

interface IParamProps {
    perfilId?: number;
}

export const searchValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(
        object({
            page: number().moreThan(0),
            filter: string(),
        })
    ),
    params: getSchema<IParamProps>(
        object({
            perfilId: number().required().integer(),
        })
    ),
}));

export const search = async (
    req: Request<IParamProps, {}, {}, IQueryProps>,
    res: Response
) => {
    if (!req.params.perfilId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: { default: 'O parâmetro "perfilId" precisa ser informado' },
        });
    }
    const result = await FilmesProvider.search(
        req.params.perfilId,
        req.query.page || 1,
        req.query.filter || ''
    );

    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(result.message);
    }

    res.setHeader(
        'access-control-expose-headers',
        'x-total-count, x-total-pages'
    );
    res.setHeader('x-total-count', result.total_results);
    res.setHeader('x-total-pages', result.total_pages);
    res.setHeader('current-page', result.page);

    return res.status(StatusCodes.OK).json(result.results);
};
