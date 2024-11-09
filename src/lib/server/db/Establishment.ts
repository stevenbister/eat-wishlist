import { eq } from 'drizzle-orm';
import type { DbClient } from './connection';
import { establishment } from './schema/establishment';
import { user } from './schema/user';
import { TableCommon } from './TableCommon';

export class Establishment extends TableCommon<typeof establishment> {
	constructor(db: DbClient) {
		super(db, establishment);
	}

	async listWithCreator() {
		const { id, name, website, visited, createdBy, createdAt } = this.schema;

		return await this.db
			.select({
				id,
				name,
				website,
				visited,
				createdAt,
				createdBy: {
					id: user.id,
					name: user.name
				}
			})
			.from(this.schema)
			.innerJoin(user, eq(createdBy, user.id));
	}
}
