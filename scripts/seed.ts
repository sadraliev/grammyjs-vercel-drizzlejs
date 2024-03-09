import { sql } from '@vercel/postgres';
async function seed() {
  // Create table with raw SQL

  await sql.query(`
  DROP TABLE IF EXISTS messages;

  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    first_name VARCHAR(256) NOT NULL,
    "created_At" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);`);

  console.log(`Created "messages" table`);
}
seed()
  .then(() => {
    console.log('Table "messages" successfully created.');
  })
  .catch((error) => {
    console.error('Error creating table "messages":', error);
  });
