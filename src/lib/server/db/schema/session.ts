import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user';

export type Session = typeof session.$inferSelect;

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', {
		mode: 'timestamp'
	}).notNull()
});
