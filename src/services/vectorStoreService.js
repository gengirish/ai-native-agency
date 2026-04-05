/**
 * Vector store integration (placeholder).
 *
 * TODO: Replace mock implementation with a real provider (e.g. Pinecone, Weaviate, pgvector).
 * TODO: Add API keys / host config via environment variables and validate on startup.
 * TODO: Implement batch upsert, namespace-per-tenant isolation, and metadata filtering in search.
 * TODO: Wire embedding model (OpenAI, Cohere, etc.) to convert text → vectors before storeEmbedding.
 * TODO: Add retry/backoff and idempotency keys for production reliability.
 */

const { query } = require('../../db/connection');
const brandService = require('./brandService');
const deliverableService = require('./deliverableService');

function tenantNamespace(tenantId) {
  return `tenant:${tenantId}`;
}

/**
 * @param {string} id
 * @param {string} text
 * @param {object} metadata
 * @param {string} namespace
 * @returns {Promise<{ id: string, stored: boolean }>}
 */
async function storeEmbedding(id, text, metadata, namespace) {
  // TODO: Call provider upsert API with vector + metadata + namespace
  console.log('[vectorStoreService.storeEmbedding] mock', {
    id,
    namespace,
    textLength: text?.length ?? 0,
    metadataKeys: metadata ? Object.keys(metadata) : [],
  });
  return { id: String(id), stored: true };
}

/**
 * @param {string} queryText
 * @param {string} namespace
 * @param {number} topK
 * @returns {Promise<Array>}
 */
async function searchSimilar(queryText, namespace, topK) {
  // TODO: Embed queryText, run similarity search in provider, return scored hits
  console.log('[vectorStoreService.searchSimilar] mock', {
    namespace,
    topK,
    queryLength: queryText?.length ?? 0,
  });
  return [];
}

/**
 * @param {string} id
 * @param {string} namespace
 * @returns {Promise<{ deleted: boolean }>}
 */
async function deleteEmbedding(id, namespace) {
  // TODO: Call provider delete by id + namespace
  console.log('[vectorStoreService.deleteEmbedding] mock', { id, namespace });
  return { deleted: true };
}

function brandProfileToEmbeddingText(profile, context) {
  const lines = [
    `Brand: ${profile.name || ''}`,
    profile.industry ? `Industry: ${profile.industry}` : null,
    profile.target_audience ? `Audience: ${profile.target_audience}` : null,
    profile.tone_of_voice ? `Tone: ${profile.tone_of_voice}` : null,
    profile.guidelines_text ? `Guidelines: ${profile.guidelines_text}` : null,
    `Colors: ${JSON.stringify(context.colors || [])}`,
    `Fonts: ${JSON.stringify(context.fonts || [])}`,
    `Logos: ${JSON.stringify(context.logoUrls || [])}`,
    `Assets: ${JSON.stringify(context.assets || [])}`,
  ];
  return lines.filter(Boolean).join('\n');
}

async function indexBrandProfile(profileId, tenantId) {
  const { profile, context } = await brandService.getProfileWithContext(profileId, tenantId);
  const text = brandProfileToEmbeddingText(profile, context);
  const embeddingId = `brand_profile:${profileId}`;
  return storeEmbedding(
    embeddingId,
    text,
    { type: 'brand_profile', profileId, tenantId },
    tenantNamespace(tenantId)
  );
}

async function indexDeliverable(deliverableId, tenantId) {
  const d = await deliverableService.getDeliverable(deliverableId, tenantId);
  const text = [
    `Deliverable: ${d.title}`,
    `Type: ${d.file_type}`,
    `Status: ${d.status}`,
    `Version: ${d.version}`,
    `URL: ${d.file_url}`,
    d.metadata ? `Metadata: ${JSON.stringify(d.metadata)}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const embeddingId = `deliverable:${deliverableId}`;
  return storeEmbedding(
    embeddingId,
    text,
    { type: 'deliverable', deliverableId, projectId: d.project_id, tenantId },
    tenantNamespace(tenantId)
  );
}

async function searchBrandContext(searchQuery, tenantId) {
  return searchSimilar(searchQuery, tenantNamespace(tenantId), 10);
}

module.exports = {
  storeEmbedding,
  searchSimilar,
  deleteEmbedding,
  indexBrandProfile,
  indexDeliverable,
  searchBrandContext,
};
