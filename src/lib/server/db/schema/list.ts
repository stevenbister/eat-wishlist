import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user';

export type List = typeof list.$inferSelect;

export const list = sqliteTable('list', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$default(() => new Date()),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});
