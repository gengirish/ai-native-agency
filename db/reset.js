const { query, disconnect } = require('./connection');

async function run() {
  const confirm = process.argv.includes('--yes');

  if (!confirm) {
    console.log('This will DROP all tables. Run with --yes to confirm.');
    process.exit(0);
  }

  console.log('Dropping all tables...\n');

  await query(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `);

  console.log('All tables dropped. Run "npm run db:migrate" to recreate.');
  await disconnect();
}

run().catch(err => {
  console.error('Reset failed:', err);
  process.exit(1);
});
