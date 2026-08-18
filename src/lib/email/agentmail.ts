/**
 * AgentMail client — transactional email for AgencyOS.
 *
 * Configured with AGENTMAIL_API_KEY + AGENTMAIL_SYSTEM_INBOX_ID. When either is
 * missing the app still runs; senders degrade to logging instead of throwing.
 */

import { AgentMailClient } from "agentmail"

let _client: AgentMailClient | null = null

export function isEmailConfigured(): boolean {
  return !!process.env.AGENTMAIL_API_KEY && !!process.env.AGENTMAIL_SYSTEM_INBOX_ID
}

export function getAgentMailClient(): AgentMailClient {
  if (!_client) {
    const apiKey = process.env.AGENTMAIL_API_KEY
    if (!apiKey) throw new Error("AGENTMAIL_API_KEY is not configured")
    _client = new AgentMailClient({ apiKey })
  }
  return _client
}

export interface SendEmailParams {
  inboxId: string
  to: string
  subject: string
  text: string
  html?: string
  replyTo?: string
  labels?: string[]
}

export async function sendEmail(params: SendEmailParams) {
  const client = getAgentMailClient()
  return client.inboxes.messages.send(params.inboxId, {
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
    replyTo: params.replyTo,
    labels: params.labels,
  })
}
