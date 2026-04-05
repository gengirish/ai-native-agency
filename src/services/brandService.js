const { query } = require('../../db/connection');
const { ValidationError, NotFoundError } = require('../utils/errors');

const ALLOWED_UPDATE_FIELDS = new Set([
  'name',
  'colors',
  'fonts',
  'tone_of_voice',
  'guidelines_text',
  'logo_urls',
  'industry',
  'target_audience',
  'status',
]);

function mapUpdatesToColumns(updates) {
  const columnMap = {
    toneOfVoice: 'tone_of_voice',
    guidelinesText: 'guidelines_text',
    logoUrls: 'logo_urls',
    targetAudience: 'target_audience',
  };
  const out = {};
  for (const [key, value] of Object.entries(updates || {})) {
    const col = columnMap[key] || key;
    if (ALLOWED_UPDATE_FIELDS.has(col)) {
      out[col] = value;
    }
  }
  return out;
}

async function createBrandProfile(tenantId, payload) {
  const {
    name = 'Primary Brand',
    colors = [],
    fonts = [],
    toneOfVoice,
    guidelinesText,
    logoUrls,
    industry,
    targetAudience,
  } = payload || {};

  if (!tenantId) {
    throw new ValidationError('tenantId is required');
  }

  const sql = `
    INSERT INTO brand_profiles (
      tenant_id, name, colors, fonts, tone_of_voice, guidelines_text,
      logo_urls, industry, target_audience, status
    )
    VALUES ($1, $2, $3::jsonb, $4::jsonb, $5, $6, $7, $8, $9, 'active')
    RETURNING *
  `;
  const params = [
    tenantId,
    name,
    JSON.stringify(colors),
    JSON.stringify(fonts),
    toneOfVoice ?? null,
    guidelinesText ?? null,
    logoUrls ?? [],
    industry ?? null,
    targetAudience ?? null,
  ];

  try {
    const { rows } = await query(sql, params);
    return rows[0];
  } catch (err) {
    if (err.code === '23505') {
      throw new ValidationError('A brand profile with this name already exists for this tenant');
    }
    throw err;
  }
}

async function getBrandProfile(profileId, tenantId) {
  const sql = `
    SELECT
      bp.*,
      COUNT(ba.id)::int AS asset_count
    FROM brand_profiles bp
    LEFT JOIN brand_assets ba ON ba.brand_profile_id = bp.id
    WHERE bp.id = $1 AND bp.tenant_id = $2
    GROUP BY bp.id
  `;
  const { rows } = await query(sql, [profileId, tenantId]);
  if (!rows[0]) {
    throw new NotFoundError('Brand profile not found');
  }
  return rows[0];
}

async function listBrandProfiles(tenantId) {
  const { rows } = await query(
    `SELECT * FROM brand_profiles WHERE tenant_id = $1 ORDER BY created_at DESC`,
    [tenantId]
  );
  return rows;
}

async function updateBrandProfile(profileId, tenantId, updates) {
  const cols = mapUpdatesToColumns(updates);
  const keys = Object.keys(cols);
  if (keys.length === 0) {
    throw new ValidationError('No valid fields to update');
  }

  await getBrandProfile(profileId, tenantId);

  const setParts = [];
  const params = [];
  let i = 1;
  for (const col of keys) {
    let val = cols[col];
    if (col === 'colors' || col === 'fonts') {
      val = JSON.stringify(val);
      setParts.push(`${col} = $${i}::jsonb`);
    } else {
      setParts.push(`${col} = $${i}`);
    }
    params.push(val);
    i += 1;
  }
  setParts.push(`updated_at = now()`);
  params.push(profileId, tenantId);

  const sql = `
    UPDATE brand_profiles
    SET ${setParts.join(', ')}
    WHERE id = $${i} AND tenant_id = $${i + 1}
    RETURNING *
  `;
  const { rows } = await query(sql, params);
  return rows[0];
}

async function deleteBrandProfile(profileId, tenantId) {
  await getBrandProfile(profileId, tenantId);
  const { rows } = await query(
    `
    UPDATE brand_profiles
    SET status = 'archived', updated_at = now()
    WHERE id = $1 AND tenant_id = $2
    RETURNING *
    `,
    [profileId, tenantId]
  );
  return rows[0];
}

async function addBrandAsset(profileId, tenantId, asset) {
  await getBrandProfile(profileId, tenantId);
  const { fileName, fileType, fileUrl, fileSizeBytes, category } = asset || {};
  if (!fileName || !fileType || !fileUrl) {
    throw new ValidationError('fileName, fileType, and fileUrl are required');
  }
  const { rows } = await query(
    `
    INSERT INTO brand_assets (
      brand_profile_id, tenant_id, file_name, file_type, file_url, file_size_bytes, category
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [profileId, tenantId, fileName, fileType, fileUrl, fileSizeBytes ?? null, category ?? null]
  );
  return rows[0];
}

async function listBrandAssets(profileId, tenantId) {
  await getBrandProfile(profileId, tenantId);
  const { rows } = await query(
    `SELECT * FROM brand_assets WHERE brand_profile_id = $1 AND tenant_id = $2 ORDER BY created_at ASC`,
    [profileId, tenantId]
  );
  return rows;
}

async function deleteBrandAsset(assetId, tenantId) {
  const { rowCount } = await query(
    `DELETE FROM brand_assets WHERE id = $1 AND tenant_id = $2`,
    [assetId, tenantId]
  );
  if (rowCount === 0) {
    throw new NotFoundError('Brand asset not found');
  }
  return { deleted: true };
}

function buildBrandContextShape(profile, assetRows) {
  return {
    colors: profile.colors,
    fonts: profile.fonts,
    tone: profile.tone_of_voice,
    guidelines: profile.guidelines_text,
    logoUrls: profile.logo_urls || [],
    assets: assetRows.map((a) => ({
      name: a.file_name,
      url: a.file_url,
      category: a.category,
    })),
  };
}

async function getProfileWithContext(profileId, tenantId) {
  const profile = await getBrandProfile(profileId, tenantId);
  const { rows: assets } = await query(
    `SELECT file_name, file_url, category FROM brand_assets
     WHERE brand_profile_id = $1 AND tenant_id = $2
     ORDER BY created_at ASC`,
    [profileId, tenantId]
  );
  return { profile, context: buildBrandContextShape(profile, assets) };
}

async function getBrandContext(profileId, tenantId) {
  const { context } = await getProfileWithContext(profileId, tenantId);
  return context;
}

/**
 * Placeholder: future implementation would scrape and analyze the site.
 * @param {string} url
 * @returns {Promise<object>}
 */
async function extractBrandFromUrl(url) {
  if (!url || typeof url !== 'string') {
    throw new ValidationError('url is required');
  }
  let host = 'example.com';
  try {
    host = new URL(url).hostname || host;
  } catch {
    throw new ValidationError('Invalid URL');
  }

  return {
    sourceUrl: url,
    name: host.replace(/^www\./, ''),
    colors: ['#1a1a2e', '#16213e', '#0f3460', '#e94560'],
    fonts: [{ family: 'Inter', role: 'body' }, { family: 'Playfair Display', role: 'headings' }],
    toneOfVoice: 'Professional, approachable, and confident.',
    industry: 'Technology / SaaS',
    targetAudience: 'B2B decision-makers and product teams',
    guidelinesText: '(Mock) Extracted from homepage hero, nav, and footer — replace with real scrape.',
    logoUrls: [`https://${host}/favicon.ico`],
  };
}

module.exports = {
  createBrandProfile,
  getBrandProfile,
  listBrandProfiles,
  updateBrandProfile,
  deleteBrandProfile,
  addBrandAsset,
  listBrandAssets,
  deleteBrandAsset,
  getBrandContext,
  getProfileWithContext,
  extractBrandFromUrl,
};
