import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { list } from './list';
import { user } from './user';

export type Establishment = typeof establishment.$inferSelect;

export const establishment = sqliteTable('establishment', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	website: text('website'),
	notes: text('notes'),
	visited: integer('visited', { mode: 'boolean' }).notNull().default(false),
	listId: integer('list_id')
		.notNull()
		.references(() => list.id, { onDelete: 'cascade' }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$default(() => new Date()),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});
