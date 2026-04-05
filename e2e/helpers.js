function adminToken() {
  return Buffer.from(JSON.stringify({
    userId: '00000000-0000-0000-0000-000000000001',
    tenantId: '00000000-0000-0000-0000-000000000001',
    role: 'admin',
  })).toString('base64');
}

function expertToken() {
  return Buffer.from(JSON.stringify({
    userId: '00000000-0000-0000-0000-000000000002',
    tenantId: '00000000-0000-0000-0000-000000000001',
    role: 'expert',
  })).toString('base64');
}

function clientToken() {
  return Buffer.from(JSON.stringify({
    userId: '00000000-0000-0000-0000-000000000003',
    tenantId: '00000000-0000-0000-0000-000000000001',
    role: 'client',
  })).toString('base64');
}

function authHeader(role = 'admin') {
  const fns = { admin: adminToken, expert: expertToken, client: clientToken };
  return { Authorization: `Bearer ${(fns[role] || adminToken)()}` };
}

module.exports = { adminToken, expertToken, clientToken, authHeader };
