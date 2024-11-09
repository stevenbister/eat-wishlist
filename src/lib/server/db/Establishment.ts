import type { DbClient } from './connection';
import { establishment } from './schema/establishment';
import { TableCommon } from './TableCommon';

export class Establishment extends TableCommon<typeof establishment> {
	constructor(db: DbClient) {
		super(db, establishment);
	}
}
