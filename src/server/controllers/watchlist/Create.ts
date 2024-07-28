import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { number, object } from 'yup';

import { WatchListProvider } from '../../database/providers';
import { validation } from '../../shared/middleware';

interface IParamProps {
    perfilId?: number;
    filmeId?: number;
}

export const createValidation = validation((getSchema) => ({
    params: getSchema<IParamProps>(
        object({
            perfilId: number().required().integer(),
            filmeId: number().required().integer(),
        })
    ),
}));

export const create = async (req: Request<IParamProps>, res: Response) => {
    if (!req.params.perfilId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: { default: 'O parâmetro "perfilId" precisa ser informado' },
        });
    }

    if (!req.params.filmeId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: { default: 'O parâmetro "filmeId" precisa ser informado' },
        });
    }
    const result = await WatchListProvider.create(
        req.params.perfilId,
        req.params.filmeId
    );
    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ errors: { default: result.message } });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
