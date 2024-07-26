import * as search from './Search';
import * as getById from './GetById';
import * as suggestd from './Suggested';

export const FilmesProvider = {
    ...search,
    ...getById,
    ...suggestd,
};
