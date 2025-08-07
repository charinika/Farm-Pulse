import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

export const animals = sqliteTable('animals', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  species: text('species').notNull(),
  breed: text('breed'),
  gender: text('gender').notNull(),
  status: text('status').notNull(),
  photoUrl: text('photo_url'),
  tagNumber: text('tag_number'),
  dateOfBirth: text('date_of_birth'),
  updatedAt: text('updated_at').notNull(),
});
