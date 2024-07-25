import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { date, object, string } from 'yup';
import { isBefore } from 'date-fns';

import { UsuariosProvider } from '../../database/providers';
import { validation } from '../../shared/middleware';
import { IUsuario } from '../../database/models';

interface IBodyProps extends Omit<IUsuario, 'id'> {}

export const signUpValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(
        object({
            nome: string().required().min(3),
            email: string().required().email().min(5),
            senha: string().required().min(6),
            dataNascimento: date()
                .required()
                .test(
                    'is-past-date',
                    'A data de nascimento deve ser no passado',
                    (value) => isBefore(value, new Date())
                ),
        })
    ),
}));

export const signUp = async (
    req: Request<{}, {}, IBodyProps>,
    res: Response
) => {
    const result = await UsuariosProvider.create(req.body);
    if (result instanceof Error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ errors: { default: result.message } });
    }
    return res.status(StatusCodes.CREATED).json(result);
};
