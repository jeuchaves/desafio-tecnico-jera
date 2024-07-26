import * as create from './Create';
import * as getByUid from './GetByUid';
import * as select from './Select';

export const PerfisController = {
    ...create,
    ...getByUid,
    ...select,
};
