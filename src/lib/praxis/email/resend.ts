/**
 * Resend email adapter for PRAXIS.
 *
 * Phase 1 sends a single email type (the invitation). Keeping this in
 * its own module means the invite endpoint tests don't pull in the
 * whole Resend SDK, and future email types (reminder, weekly digest)
 * slot in next to `sendInvitation`.
 */
import 'server-only';
import { Resend } from 'resend';

export enum EmailDeliveryStatus {
  SENT = 'sent',
  FAILED = 'failed',
}

export interface InvitationEmailParams {
  to: string;
  /** Fully-qualified `/learn/callback?token=...` URL. */
  actionUrl: string;
  /** Friendly label for the invitee, if known. */
  displayName?: string | null;
}

export interface SendResult {
  status: EmailDeliveryStatus;
  providerId: string | null;
  error: string | null;
}

function readConfig(): { apiKey: string; fromAddress: string; fromName: string } {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set. Add it to .env.local.');
  }
  return {
    apiKey,
    fromAddress: process.env.PRAXIS_EMAIL_FROM ?? 'praxis@thanachon.me',
    fromName: process.env.PRAXIS_EMAIL_FROM_NAME ?? 'PRAXIS · Thanachon Supasatian',
  };
}

function renderInvitationHtml({ actionUrl, displayName }: InvitationEmailParams): string {
  const greeting = displayName ? `Hi ${displayName},` : 'Hi there,';
  // Keep HTML minimal — inline styles only, table-free, no custom fonts.
  return `<!doctype html>
<html>
  <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;line-height:1.55;color:#1f2937;max-width:560px;margin:0 auto;padding:24px">
    <h1 style="font-size:20px;margin:0 0 16px">You're invited to PRAXIS</h1>
    <p>${greeting}</p>
    <p>PRAXIS is a small, invite-only learning space. You can turn any topic you care about into a short, personalised course and talk it through with a coach named Nori.</p>
    <p style="margin:32px 0">
      <a href="${actionUrl}" style="display:inline-block;background:#111827;color:#f9fafb;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:500">
        Start your course
      </a>
    </p>
    <p style="color:#6b7280;font-size:13px">This link is valid for 15 minutes and can only be used once. If you didn't expect this email, you can safely ignore it.</p>
  </body>
</html>`;
}

function renderInvitationText({ actionUrl, displayName }: InvitationEmailParams): string {
  const greeting = displayName ? `Hi ${displayName},` : 'Hi there,';
  return [
    greeting,
    '',
    'You\'re invited to PRAXIS, a small, invite-only learning space.',
    'Turn any topic you care about into a short, personalised course and talk it through with a coach named Nori.',
    '',
    'Start your course:',
    actionUrl,
    '',
    'This link is valid for 15 minutes and can only be used once.',
    'If you didn\'t expect this email, you can safely ignore it.',
  ].join('\n');
}

export async function sendInvitationEmail(params: InvitationEmailParams): Promise<SendResult> {
  const { apiKey, fromAddress, fromName } = readConfig();
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to: params.to,
      subject: "You're invited to PRAXIS",
      html: renderInvitationHtml(params),
      text: renderInvitationText(params),
    });

    if (error) {
      return { status: EmailDeliveryStatus.FAILED, providerId: null, error: error.message };
    }
    return { status: EmailDeliveryStatus.SENT, providerId: data?.id ?? null, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: EmailDeliveryStatus.FAILED, providerId: null, error: message };
  }
}
