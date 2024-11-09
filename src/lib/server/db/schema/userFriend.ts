import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user';

export type UserFriend = typeof userFriend.$inferSelect;

export const userFriend = sqliteTable('user_friend', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	userId1: text('user_id_1')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	userId2: text('user_id_2')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	status: text('status', { enum: ['req_uid1', 'req_uid2', 'friend'] }).notNull()
});
