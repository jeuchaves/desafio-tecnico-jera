import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { number, object } from 'yup';

import { validation } from '../../shared/middleware';
import { WatchListProvider } from '../../database/providers';

interface IParamProps {
    id?: number;
}

export const markAsWatchedValidation = validation((getSchema) => ({
    params: getSchema<IParamProps>(
        object({
            id: number().moreThan(0).required().integer(),
        })
    ),
}));

export const markAsWatched = async (
    req: Request<IParamProps>,
    res: Response
) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado.',
            },
        });
    }

    if (!req.session.perfilId) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ errors: { default: 'Perfil não encontrado' } });
    }

    const result = await WatchListProvider.markAsWatched(req.params.id);
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message,
            },
        });
    }
    return res.status(StatusCodes.NO_CONTENT).json(result);
};
