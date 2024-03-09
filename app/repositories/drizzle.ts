import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from '@vercel/postgres';
import { log } from 'console';

export const db = drizzle(sql);

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  first_name: varchar('first_name', { length: 256 }).notNull(),
  created_At: timestamp('created_At').defaultNow(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export const getMessages = async (): Promise<void> => {
  const selectResult = await db.select().from(messages);
  log('selectResult', selectResult);
};

export const insertMessage = async (message: NewMessage): Promise<void> => {
  const insertResult = await db.insert(messages).values(message).returning();
  log('insertResult', insertResult);
};
