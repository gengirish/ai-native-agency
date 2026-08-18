/**
 * Password-reset email. Never throws — a missing AgentMail config or a transient
 * send failure must not break the forgot-password route (which always returns the
 * same generic response anyway). The link is also logged server-side so an
 * operator can recover an account while email is unconfigured.
 */

import { isEmailConfigured, sendEmail } from "./agentmail"
import { PASSWORD_RESET_TTL_MINUTES } from "@/lib/auth/password-reset"

export interface SendPasswordResetEmailParams {
  to: string
  name?: string
  rawToken: string
  /** Request origin, used only outside production — see resolveBaseUrl. */
  requestOrigin?: string
}

/**
 * The reset link's host must not come from a user-controlled Host header in
 * production, or an attacker could get a victim's token delivered to their own
 * domain. NEXT_PUBLIC_APP_URL is authoritative there; the request origin is only
 * a dev convenience.
 */
function resolveBaseUrl(requestOrigin?: string): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "")

  // Outside production the request origin wins, so a local run still produces
  // localhost links even though NEXT_PUBLIC_APP_URL points at the deployed host.
  if (process.env.NODE_ENV !== "production" && requestOrigin) {
    return requestOrigin.replace(/\/$/, "")
  }

  if (configured) return configured

  // Platform-supplied and not attacker-controllable (unlike the Host header),
  // so it is a safe last resort when NEXT_PUBLIC_APP_URL was never set. Without
  // it a production deploy silently mails out unusable localhost links.
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim()
  if (vercelHost) {
    return `https://${vercelHost.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
  }

  return "http://localhost:3000"
}

export async function sendPasswordResetEmail(
  params: SendPasswordResetEmailParams,
): Promise<{ delivered: boolean; reason?: string }> {
  const baseUrl = resolveBaseUrl(params.requestOrigin)
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(params.rawToken)}`

  if (!isEmailConfigured()) {
    console.warn(
      `[password-reset] AgentMail not configured — reset link for ${params.to}: ${resetUrl} (expires in ${PASSWORD_RESET_TTL_MINUTES} min)`,
    )
    return { delivered: false, reason: "AgentMail is not configured" }
  }

  try {
    await sendEmail({
      inboxId: process.env.AGENTMAIL_SYSTEM_INBOX_ID!,
      to: params.to,
      subject: "Reset your AgencyOS password",
      text: buildText(params.name, resetUrl),
      html: buildHtml(params.name, resetUrl),
      labels: ["transactional", "password-reset"],
    })
    return { delivered: true }
  } catch (err) {
    console.error("[password-reset] AgentMail send failed:", err)
    return { delivered: false, reason: err instanceof Error ? err.message : "unknown" }
  }
}

function buildText(name: string | undefined, resetUrl: string): string {
  return `Hi ${name || "there"},

Someone (hopefully you) asked to reset the password on your AgencyOS account.

Open this link to choose a new password. It works once and expires in ${PASSWORD_RESET_TTL_MINUTES} minutes:

${resetUrl}

If you didn't request this, ignore this email — your password will not change.

— AgencyOS`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function buildHtml(name: string | undefined, resetUrl: string): string {
  // Inline styles only — email clients strip <style> blocks inconsistently.
  const greeting = escapeHtml(name || "there")
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#020617;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;color:#e2e8f0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#020617">
      <tr>
        <td align="center" style="padding:40px 16px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0f172a;border:1px solid #1e293b;border-radius:16px">
            <tr>
              <td style="padding:32px 32px 8px">
                <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff">AgencyOS</p>
                <p style="margin:4px 0 0;font-size:13px;color:#94a3b8">AI-Native Agency Platform</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 0">
                <p style="margin:0 0 12px;font-size:15px;line-height:1.6">Hi ${greeting},</p>
                <p style="margin:0 0 12px;font-size:15px;line-height:1.6">
                  Someone (hopefully you) asked to reset the password on your AgencyOS account.
                  Choose a new one with the button below.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 32px">
                <a href="${resetUrl}" style="display:inline-block;background:#4f46e5;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:10px">Reset password</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 24px">
                <p style="margin:0 0 8px;font-size:13px;color:#94a3b8">Or paste this link into your browser:</p>
                <p style="margin:0;font-size:12px;color:#818cf8;word-break:break-all">${resetUrl}</p>
                <p style="margin:20px 0 0;font-size:13px;color:#94a3b8">
                  This link works once and expires in ${PASSWORD_RESET_TTL_MINUTES} minutes.
                  If you didn't request it, ignore this email — your password will not change.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
