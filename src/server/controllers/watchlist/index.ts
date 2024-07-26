import * as create from './Create';
import * as getAll from './GetAll';
import * as markAsWatched from './MarkAsWatched';

export const WatchListController = {
    ...create,
    ...getAll,
    ...markAsWatched,
};
