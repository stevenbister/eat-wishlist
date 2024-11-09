import type { DbClient } from './connection';
import { list } from './schema/list';
import { TableCommon } from './TableCommon';

export class List extends TableCommon<typeof list> {
	constructor(db: DbClient) {
		super(db, list);
	}
}
