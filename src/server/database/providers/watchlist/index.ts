import * as create from './Create';
import * as getAll from './GetAll';
import * as count from './Count';
import * as markAsWatched from './MarkAsWatched';

export const WatchListProvider = {
    ...create,
    ...getAll,
    ...count,
    ...markAsWatched,
};
