import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { number, object } from 'yup';

import { validation } from '../../shared/middleware';
import { PerfisProvider } from '../../database/providers';

interface IBodyProps {
    perfilId: number;
}

export const selectValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(object({ perfilId: number().required() })),
}));

export const select = async (
    req: Request<{}, {}, IBodyProps>,
    res: Response
) => {
    const { perfilId } = req.body;
    const uid = Number(req.headers.idUsuario);
    const result = await PerfisProvider.select(uid, perfilId);
    if (result instanceof Error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ errors: { default: result.message } });
    }
    req.session.perfilId = perfilId;
    return res.status(StatusCodes.NO_CONTENT).send();
};
