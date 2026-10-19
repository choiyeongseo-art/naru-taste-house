import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const homes = sqliteTable('taste_homes', {
  userId: text('user_id').primaryKey(),
  nickname: text('nickname').notNull(),
  state: text('state').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
