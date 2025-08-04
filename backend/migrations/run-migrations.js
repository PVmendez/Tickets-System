import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function createMigrationsTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(createTableSQL);
}

async function isMigrationExecuted(filename) {
  const result = await pool.query('SELECT 1 FROM migrations WHERE filename = $1', [filename]);
  return result.rowCount > 0;
}

async function markMigrationAsExecuted(filename) {
  await pool.query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
}

async function runSqlFile(filePath) {
  const filename = path.basename(filePath);
  
  if (await isMigrationExecuted(filename)) {
    console.log(`Saltando: ${filename} (ya ejecutado)`);
    return;
  }
  
  const sql = fs.readFileSync(filePath, 'utf8');
  await pool.query(sql);
  await markMigrationAsExecuted(filename);
  console.log(`Ejecutado: ${filename}`);
}

async function main() {
  await createMigrationsTable();
  
  const dir = path.resolve('migrations');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  
  for (const file of files) {
    await runSqlFile(path.join(dir, file));
  }
  
  await pool.end();
  console.log('Migraciones completadas.');
}

main().catch(err => {
  console.error('Error en migraciones:', err);
  process.exit(1);
});
