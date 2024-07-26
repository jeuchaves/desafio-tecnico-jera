import * as create from './Create';
import * as getByUid from './GetByUid';
import * as count from './Count';
import * as select from './Select';

export const PerfisProvider = {
    ...create,
    ...getByUid,
    ...count,
    ...select,
};
