const { query } = require('../../db/connection');

const IMAGE_TASK_TYPES = new Set([
  'generate_logo',
  'generate_social_graphics',
  'generate_business_card',
]);

const ERROR_SNIPPETS = [
  'error:',
  'api error',
  'failed to',
  'exception',
  'undefined is not',
];

function extractText(output) {
  if (output == null) return '';
  if (typeof output === 'string') return output;
  if (typeof output.content === 'string') return output.content;
  if (typeof output.text === 'string') return output.text;
  if (typeof output.result === 'string') return output.result;
  try {
    return JSON.stringify(output);
  } catch {
    return '';
  }
}

function extractImageUrl(output) {
  if (!output || typeof output !== 'object') return '';
  if (typeof output.imageUrl === 'string') return output.imageUrl;
  if (typeof output.url === 'string') return output.url;
  return '';
}

function looksLikeGibberish(text) {
  const t = text.trim();
  if (t.length < 20) return true;
  const letters = (t.match(/[a-zA-Z]/g) || []).length;
  if (letters / t.length < 0.15) return true;
  if (/(.)\1{8,}/.test(t)) return true;
  return false;
}

function toneKeywords(tone) {
  const t = String(tone || '').toLowerCase();
  const map = {
    professional: ['professional', 'clear', 'trust', 'quality', 'reliable'],
    playful: ['fun', 'bold', 'energy', 'vibrant', 'playful'],
    luxury: ['premium', 'elegant', 'exclusive', 'refined', 'luxury'],
    friendly: ['warm', 'welcome', 'together', 'community', 'friendly'],
  };
  return map[t] || ['brand', 'audience', 'message'];
}

function validateUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

function imageFormatOk(url) {
  if (!validateUrl(url)) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes('.png') ||
    lower.includes('.jpg') ||
    lower.includes('jpeg') ||
    lower.includes('.webp') ||
    lower.includes('oaidalle') ||
    lower.includes('openai')
  );
}

const qaService = {
  validateOutput(taskType, output, brief) {
    const issues = [];
    let score = 1;

    const emptyCheck = () => {
      const text = extractText(output);
      const url = extractImageUrl(output);
      if (IMAGE_TASK_TYPES.has(taskType)) {
        if (!url) {
          issues.push('Image output missing URL');
          score *= 0;
          return false;
        }
      } else if (!text || text.trim().length === 0) {
        issues.push('Output is empty');
        score *= 0;
        return false;
      }
      return true;
    };

    if (!emptyCheck()) {
      return { passed: false, issues, score: 0 };
    }

    const haystack = extractText(output).toLowerCase();
    for (const snip of ERROR_SNIPPETS) {
      if (haystack.includes(snip)) {
        issues.push(`Possible error phrase in output: ${snip}`);
        score *= 0.6;
      }
    }

    if (IMAGE_TASK_TYPES.has(taskType)) {
      const url = extractImageUrl(output);
      if (!validateUrl(url)) {
        issues.push('Image URL is not a valid HTTP(S) URL');
        score *= 0.3;
      } else if (!imageFormatOk(url)) {
        issues.push('Image URL format could not be verified (expected common image host/path)');
        score *= 0.85;
      }
    } else {
      const text = extractText(output);
      if (text.length < 40) {
        issues.push('Text output is very short');
        score *= 0.7;
      }
      if (looksLikeGibberish(text)) {
        issues.push('Text may be low-signal or gibberish');
        score *= 0.5;
      }

      const tone = brief?.tone || 'professional';
      const keywords = toneKeywords(tone);
      const textLower = text.toLowerCase();
      const hits = keywords.filter((k) => textLower.includes(k)).length;
      if (hits === 0 && text.length > 80) {
        issues.push(`Few obvious tone cues for "${tone}" (keyword heuristic)`);
        score *= 0.85;
      }
    }

    const passed = issues.length === 0 || score >= 0.65;
    return { passed, issues, score: Math.max(0, Math.min(1, score)) };
  },

  async overallQualityScore(pipelineRunId) {
    const runRes = await query(
      `SELECT brief_id FROM pipeline_runs WHERE id = $1`,
      [pipelineRunId]
    );
    if (runRes.rows.length === 0) return { averageScore: null, taskCount: 0 };

    const briefRes = await query(`SELECT * FROM briefs WHERE id = $1`, [runRes.rows[0].brief_id]);
    const brief = briefRes.rows[0] || {};

    const tasksRes = await query(
      `SELECT task_type, output_data, status FROM pipeline_tasks WHERE pipeline_run_id = $1`,
      [pipelineRunId]
    );

    const tasks = tasksRes.rows.filter((t) => t.status === 'completed');
    if (tasks.length === 0) return { averageScore: null, taskCount: 0 };

    let sum = 0;
    for (const t of tasks) {
      const stored = t.output_data?.qa?.score;
      if (typeof stored === 'number') {
        sum += stored;
      } else {
        const v = this.validateOutput(t.task_type, t.output_data || {}, brief);
        sum += v.score;
      }
    }

    return {
      averageScore: sum / tasks.length,
      taskCount: tasks.length,
    };
  },

  async flagForReview(projectId, issues) {
    await query(
      `UPDATE projects SET status = 'in_review', updated_at = now() WHERE id = $1`,
      [projectId]
    );
    return { projectId, issues: issues || [], status: 'in_review' };
  },
};

module.exports = qaService;
