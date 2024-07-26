import * as create from './Create';
import * as getAll from './GetAll';
import * as count from './Count';

export const WatchListProvider = {
    ...create,
    ...getAll,
    ...count,
};
