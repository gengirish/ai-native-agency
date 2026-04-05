function tenantIsolation(req, res, next) {
  if (!req.user) {
    return res.status(403).json({ error: { message: 'Tenant context required', code: 'FORBIDDEN' } });
  }

  let tenantId = req.user.tenantId;
  const isAdmin = req.user.role === 'admin';
  const headerTenant = req.headers['x-tenant-id'];

  if (isAdmin && headerTenant) {
    tenantId = headerTenant;
  }

  if (tenantId == null || tenantId === '') {
    return res.status(403).json({ error: { message: 'Tenant context required', code: 'FORBIDDEN' } });
  }

  req.tenantId = tenantId;
  next();
}

module.exports = { tenantIsolation };
