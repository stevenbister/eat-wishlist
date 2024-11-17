import { and, eq } from 'drizzle-orm';
import type { DbClient } from './connection';
import { list } from './schema/list';
import { TableCommon } from './TableCommon';

export class List extends TableCommon<typeof list> {
	constructor(db: DbClient) {
		super(db, list);
	}

	async getDefault(currentUserId: string) {
		return await this.db
			.select()
			.from(this.schema)
			.where(and(eq(this.schema.createdBy, currentUserId), eq(this.schema.name, 'Default')));
	}
}
