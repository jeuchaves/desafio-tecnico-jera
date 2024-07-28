import * as create from './Create';
import * as getByUid from './GetByUid';
import * as count from './Count';

export const PerfisProvider = {
    ...create,
    ...getByUid,
    ...count,
};
