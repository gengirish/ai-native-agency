const fs = require('fs');
const path = require('path');
const { query, disconnect } = require('./connection');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function ensureMigrationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id          SERIAL PRIMARY KEY,
      filename    VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function getExecutedMigrations() {
  const res = await query('SELECT filename FROM schema_migrations ORDER BY filename');
  return new Set(res.rows.map(r => r.filename));
}

async function run() {
  console.log('Starting database migration...\n');

  await ensureMigrationsTable();
  const executed = await getExecutedMigrations();

  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  let applied = 0;

  for (const file of files) {
    if (executed.has(file)) {
      console.log(`  SKIP  ${file} (already applied)`);
      continue;
    }

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

    try {
      await query('BEGIN');
      await query(sql);
      await query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
      await query('COMMIT');
      console.log(`  OK    ${file}`);
      applied++;
    } catch (err) {
      await query('ROLLBACK');
      console.error(`  FAIL  ${file}`);
      console.error(`        ${err.message}`);
      process.exit(1);
    }
  }

  console.log(`\nDone. ${applied} migration(s) applied, ${files.length - applied} skipped.`);
  await disconnect();
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
