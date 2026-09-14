export interface EmailAdapter {
  send(to: string, subject: string, html: string, from?: string): Promise<void>;
}

// Cloudflare Workers Mail adapter (default, zero cost)
export class CloudflareMailAdapter implements EmailAdapter {
  async send(to: string, subject: string, html: string, from: string = 'noreply@skillpage.io'): Promise<void> {
    // Use Cloudflare Workers Mail API
    const message = { from, to, subject, html };
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/' + process.env.CF_ACCOUNT_ID + '/email/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.CF_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (!response.ok) throw new Error(`Failed to send email: ${response.statusText}`);
  }
}

// SendGrid adapter (future, paid but scalable)
export class SendGridAdapter implements EmailAdapter {
  async send(to: string, subject: string, html: string, from: string = 'noreply@skillpage.io'): Promise<void> {
    const response = await fetch('https://api.sendgrid.net/v3/mail/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    });
    if (!response.ok) throw new Error(`Failed to send email: ${response.statusText}`);
  }
}

// Factory function to get adapter based on env
export function getEmailAdapter(): EmailAdapter {
  const provider = process.env.EMAIL_PROVIDER || 'cloudflare';
  if (provider === 'sendgrid') return new SendGridAdapter();
  return new CloudflareMailAdapter();
}
