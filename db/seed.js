const bcrypt = require('bcryptjs');
const { query, disconnect } = require('./connection');

const DEMO_PASSWORD = 'test1234';

const DEMO_USERS = [
  { name: 'Alex Morgan',  email: 'admin@agencyos.dev',  role: 'admin',  tenantSlug: 'demo-agency' },
  { name: 'Jordan Lee',   email: 'expert@agencyos.dev', role: 'expert', tenantSlug: 'demo-agency' },
  { name: 'Sam Rivera',   email: 'client@agencyos.dev', role: 'client', tenantSlug: 'demo-client' },
];

async function seed() {
  console.log('Seeding demo data...\n');
  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

  const tenantRes = await query(`
    INSERT INTO tenants (name, slug, plan)
    VALUES ('Demo Agency', 'demo-agency', 'professional')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
  `);
  const agencyTenantId = tenantRes.rows[0].id;

  const clientTenantRes = await query(`
    INSERT INTO tenants (name, slug, plan)
    VALUES ('Demo Client Co', 'demo-client', 'starter')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
  `);
  const clientTenantId = clientTenantRes.rows[0].id;

  for (const u of DEMO_USERS) {
    const tenantId = u.tenantSlug === 'demo-agency' ? agencyTenantId : clientTenantId;
    const res = await query(`
      INSERT INTO users (tenant_id, email, name, role, password_hash)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        password_hash = EXCLUDED.password_hash,
        tenant_id = EXCLUDED.tenant_id
      RETURNING id, email, role
    `, [tenantId, u.email, u.name, u.role, passwordHash]);

    console.log(`  ${res.rows[0].role.padEnd(8)} ${res.rows[0].email} (${res.rows[0].id})`);
  }

  console.log(`\nDemo password for all accounts: ${DEMO_PASSWORD}`);
  console.log('Done.');
  await disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
