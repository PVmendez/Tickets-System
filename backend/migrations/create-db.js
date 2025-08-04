import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const config = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: 'postgres',
};

async function createDatabase() {
  const client = new pg.Client(config);
  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Base de datos '${DB_NAME}' creada.`);
    } else {
      console.log(`La base de datos '${DB_NAME}' ya existe.`);
    }
  } catch (err) {
    console.error('Error creando la base de datos:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
