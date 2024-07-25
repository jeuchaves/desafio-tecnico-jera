import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { PerfisProvider } from '../../database/providers';

export const getByUid = async (req: Request, res: Response) => {
    const uid = Number(req.headers.idUsuario);
    const result = await PerfisProvider.getByUid(uid);
    const count = await PerfisProvider.count();

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message,
            },
        });
    } else if (count instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send(count.message);
    }

    res.setHeader('access-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', count);

    return res.status(StatusCodes.OK).json(result);
};
