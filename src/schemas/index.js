const Joi = require('joi');

const uuid = Joi.string().uuid();

const createProject = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  projectType: Joi.string().valid('design', 'content', 'ad_copy', 'legal', 'video').required(),
  brandProfileId: uuid.optional(),
  priority: Joi.string().valid('low', 'normal', 'high', 'urgent').default('normal'),
  dueDate: Joi.date().iso().optional(),
  priceCents: Joi.number().integer().min(0).default(0),
});

const updateProjectStatus = Joi.object({
  status: Joi.string().valid('draft','submitted','processing','in_review','revision_requested','approved','delivered','cancelled').required(),
});

const createBrief = Joi.object({
  projectId: uuid.required(),
  briefType: Joi.string().valid('design', 'content', 'ad_copy', 'legal', 'video').required(),
  content: Joi.object().required(),
  referenceUrls: Joi.array().items(Joi.string().uri()).default([]),
  targetAudience: Joi.string().allow('').optional(),
  tone: Joi.string().allow('').optional(),
  dimensions: Joi.object().optional(),
  additionalNotes: Joi.string().allow('').optional(),
});

const createBrandProfile = Joi.object({
  name: Joi.string().min(1).max(255).default('Primary Brand'),
  colors: Joi.array().items(Joi.string()).default([]),
  fonts: Joi.array().items(Joi.string()).default([]),
  toneOfVoice: Joi.string().allow('').optional(),
  guidelinesText: Joi.string().allow('').optional(),
  logoUrls: Joi.array().items(Joi.string().uri()).default([]),
  industry: Joi.string().allow('').optional(),
  targetAudience: Joi.string().allow('').optional(),
});

const createDeliverable = Joi.object({
  projectId: uuid.required(),
  pipelineTaskId: uuid.optional(),
  title: Joi.string().min(1).max(255).required(),
  fileType: Joi.string().required(),
  fileUrl: Joi.string().uri().required(),
  thumbnailUrl: Joi.string().uri().optional(),
  fileSizeBytes: Joi.number().integer().min(0).optional(),
  metadata: Joi.object().default({}),
});

const runPipeline = Joi.object({
  projectId: uuid.required(),
  briefId: uuid.required(),
  tier: Joi.string().valid('starter', 'professional', 'premium').optional(),
});

const addFeedback = Joi.object({
  projectId: uuid.required(),
  deliverableId: uuid.required(),
  comment: Joi.string().min(1).required(),
  feedbackType: Joi.string().valid('comment', 'approval', 'revision_request', 'rejection').default('comment'),
  metadata: Joi.object().default({}),
});

const approveReview = Joi.object({
  qualityScore: Joi.number().min(0).max(5).precision(2).required(),
  reviewNotes: Joi.string().allow('').optional(),
  timeSpentMins: Joi.number().integer().min(0).optional(),
});

const pagination = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().optional(),
  projectType: Joi.string().optional(),
}).unknown(true);

module.exports = {
  createProject,
  updateProjectStatus,
  createBrief,
  createBrandProfile,
  createDeliverable,
  runPipeline,
  addFeedback,
  approveReview,
  pagination,
};
