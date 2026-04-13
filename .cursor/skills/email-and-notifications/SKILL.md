---
name: email-and-notifications
description: >-
  Add transactional or agent-style email to AgencyOS-related work. Use when implementing
  invites, magic links, client notifications, or agent inbox flows. Summarizes Resend (Next.js)
  vs AgentMail (programmatic inboxes) without duplicating full vendor docs.
---

# Email & notifications (AgencyOS ecosystem)

## When to use what

| Need | Typical choice | Notes |
|------|----------------|--------|
| Transactional email from Next.js (signup, receipts, alerts) | **Resend** (or similar SMTP/API) | Simple REST, good DX with React Email. Aligns with other Next projects (e.g. marketing sites using `resend`). |
| AI/agent inboxes, threads, parse inbound, verification codes | **AgentMail** | API-first inboxes; see user’s personal skill `~/.cursor/skills/agentmail-integration` for full steps. |

## Rules

- Secrets only in env (`RESEND_API_KEY`, `AGENTMAIL_API_KEY`, etc.) and Vercel project settings — never commit.
- Document new vars in `.env.example`.
- For AgencyOS **product**, prefer one provider per use-case to keep compliance and deliverability clear.

## Minimal Resend pattern (Next Route Handler)

1. `npm install resend`
2. Route handler calls `new Resend(process.env.RESEND_API_KEY).emails.send({...})`
3. Validate recipient server-side; rate-limit public endpoints.

## AgentMail

For deep integration (webhooks, threads, attachments), open and follow **`agentmail-integration`** in the user’s global skills folder — too long to duplicate here.
