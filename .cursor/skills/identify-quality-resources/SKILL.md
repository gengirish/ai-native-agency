---
name: identify-quality-resources
description: >-
  Find and evaluate high-quality learning resources for AI code reviewer training topics.
  Use when the user asks for resources, references, study material, papers, or documentation
  to add to NotebookLM, or when preparing course content for any module of the AI Code
  Reviewer curriculum.
---

# Identify High-Quality Resources

## Purpose

Systematically find, evaluate, and recommend authoritative resources for AI Code Reviewer training topics. Optimized for building NotebookLM source libraries.

## Resource Evaluation Framework

Before recommending any resource, score it against these criteria:

| Criterion | What qualifies | Red flags |
|---|---|---|
| **Author authority** | Researchers, company engineers (OpenAI, Anthropic, Google, Scale AI), university faculty | Anonymous blogs, no credentials listed |
| **Recency** | 2024–2026 preferred (field moves fast) | Pre-2023 for LLM/RLHF topics |
| **Peer review** | Published at ICML, NeurIPS, ACL, AAAI, or in official docs | Unsourced claims, no citations |
| **Practical grounding** | Includes code examples, exercises, benchmarks | Theory-only with no application |
| **Primary vs secondary** | Original papers, official documentation, first-party blogs | Third-party summaries of summaries |
| **Platform reputation** | arXiv, MIT OCW, Stanford CS, Real Python, official company blogs | Random Medium posts, SEO-farm sites |

Only recommend resources that pass at least 4 of 6 criteria.

## Where to Search (by resource type)

### Academic & Research

- **Papers**: arXiv.org, Semantic Scholar, Papers With Code
- **Surveys**: Search `"survey" OR "comprehensive review"` on arXiv
- **Benchmarks**: CodeReviewBench.com, Qodo AI, Greptile evaluations

### Official & Primary Sources

- **LLM documentation**: OpenAI docs, Anthropic docs/research blog, Google DeepMind blog
- **Alignment research**: OpenAI alignment blog, Anthropic research page
- **Industry platforms**: Scale AI blog, Outlier AI, Surge AI

### University Courses & Textbooks

- MIT OpenCourseWare (6.102, 6.006)
- Stanford CS229, CS231n, CS224n
- CMU 15-112, 15-213
- UC Berkeley CS61A, CS61B

### Practical Tutorials

- Real Python (debugging, code analysis)
- AlgoCademy (systematic learning paths)
- freeCodeCamp (broad coverage, free)
- CodeFix (code reading methodology)

## Search Strategy

When the user requests resources for a topic:

1. **Identify the topic category** (module or theme the user names).
2. **Run 2–3 targeted web searches** combining:
   - The specific topic keywords
   - Authority qualifiers: `site:arxiv.org`, `site:openai.com`, `"MIT"`, `"Stanford"`
   - Recency: append current or previous year
3. **Evaluate each result** against the 6-criteria framework above
4. **Organize recommendations** by subtopic with:
   - Title and URL
   - One-line reason it qualifies (authority, depth, practicality)
   - What specifically to extract for NotebookLM

## Output Format

Structure recommendations for easy NotebookLM ingestion:

```markdown
### [Topic Name]

**[Resource Title]** — [Type: Paper/Docs/Course/Tutorial]
- URL: [link]
- Why: [one-line justification against criteria]
- Key content: [what to extract for NotebookLM]
```

## NotebookLM Organization Tips

When advising on NotebookLM setup:

- **One notebook per module** (or per 2 tightly related sessions)
- **8–12 sources per notebook** to keep queries focused
- **Prefer PDF links** for arXiv papers (`arxiv.org/pdf/XXXX.XXXXX`)
- **Add URLs directly** for web pages — NotebookLM ingests them
- **Test after adding**: ask NotebookLM a question about the source to verify ingestion
- **Label notebooks clearly**: e.g., "Module 1 - AI Code Review Fundamentals"

## Quality Tiers

Rank resources into tiers when presenting:

- **Tier 1 (Must-add)**: Peer-reviewed papers, official docs, university course material — add these first
- **Tier 2 (Recommended)**: Well-written technical blogs from known authors, reputable tutorial sites
- **Tier 3 (Supplementary)**: Community resources, Stack Overflow compilations, comparison articles

Always present Tier 1 resources first. Only include Tier 3 if Tier 1 and 2 do not cover the subtopic.
