function parseBearerToken(authorization) {
  if (!authorization || typeof authorization !== 'string') {
    return null;
  }
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

function authenticate(req, res, next) {
  const raw = parseBearerToken(req.headers.authorization);
  if (!raw) {
    return res.status(401).json({ error: { message: 'Authentication required', code: 'UNAUTHORIZED' } });
  }

  let payload;
  try {
    const decoded = Buffer.from(raw, 'base64').toString('utf8');
    payload = JSON.parse(decoded);
  } catch {
    return res.status(401).json({ error: { message: 'Invalid token', code: 'INVALID_TOKEN' } });
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    payload.userId == null ||
    payload.tenantId == null ||
    payload.role == null
  ) {
    return res.status(401).json({ error: { message: 'Invalid token payload', code: 'INVALID_TOKEN' } });
  }

  req.user = {
    id: payload.userId,
    tenantId: payload.tenantId,
    role: String(payload.role),
  };
  next();
}

function requireRole(...roles) {
  const allowed = roles.flat();
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Forbidden', code: 'FORBIDDEN' } });
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
