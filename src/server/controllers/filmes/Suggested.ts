import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { number, object } from 'yup';

import { validation } from '../../shared/middleware';
import { FilmesProvider } from '../../database/providers';

interface IQueryProps {
    page?: number;
    deep?: number;
}

export const suggestedValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(
        object({
            page: number().moreThan(0),
            deep: number(),
        })
    ),
}));

export const suggested = async (
    req: Request<{}, {}, {}, IQueryProps>,
    res: Response
) => {
    const perfilId = req.session.perfilId;
    if (!perfilId) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ errors: { default: 'Perfil não encontrado' } });
    }

    const result = await FilmesProvider.suggested(
        req.query.page || 1,
        perfilId,
        req.query.deep || 2
    );

    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ errors: { default: result.message } });
    }

    res.setHeader('access-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', result.total_results);
    res.setHeader('x-total-pages', result.total_pages);
    res.setHeader('current-page', result.page);

    return res.status(StatusCodes.OK).json(result.results);
};
