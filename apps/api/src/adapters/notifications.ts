export interface NotificationAdapter {
  sendInApp(userId: string, type: string, title: string, body: string): Promise<void>;
  sendEmail(userId: string, type: string, subject: string, html: string): Promise<void>;
  sendPush(userId: string, title: string, body: string, data?: any): Promise<void>;
}

// Cloudflare Queues + Email adapter (zero cost)
export class CloudflareNotificationAdapter implements NotificationAdapter {
  async sendInApp(userId: string, type: string, title: string, body: string): Promise<void> {
    const db = (global as any).DB;
    const notificationId = crypto.randomUUID();
    await db.prepare('INSERT INTO notifications (id, user_id, type, title, body, is_read, email_sent, created_at) VALUES (?, ?, ?, ?, ?, 0, 0, ?)')
      .bind(notificationId, userId, type, title, body, new Date().toISOString()).run();
  }

  async sendEmail(userId: string, type: string, subject: string, html: string): Promise<void> {
    // Queue email for async sending
    const db = (global as any).DB;
    const user: any = await db.prepare('SELECT email FROM users WHERE id = ?').bind(userId).first();
    if (user && user.email) {
      // Add to email queue (stub - implement queue consumer)
      console.log(`Queued email to ${user.email}: ${subject}`);
    }
  }

  async sendPush(): Promise<void> {
    // Web Push API (stub - implement with service workers)
    console.log('Push notification not yet implemented');
  }
}

// Firebase adapter (paid, for push notifications)
export class FirebaseNotificationAdapter implements NotificationAdapter {
  async sendInApp(userId: string, type: string, title: string, body: string): Promise<void> {
    // Same as Cloudflare adapter
    await new CloudflareNotificationAdapter().sendInApp(userId, type, title, body);
  }

  async sendEmail(userId: string, type: string, subject: string, html: string): Promise<void> {
    await new CloudflareNotificationAdapter().sendEmail(userId, type, subject, html);
  }

  async sendPush(userId: string, title: string, body: string, data?: any): Promise<void> {
    // Use Firebase Cloud Messaging
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.FCM_SERVER_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: userId, // FCM token
        notification: { title, body },
        data,
      }),
    });
    if (!response.ok) throw new Error(`Failed to send push: ${response.statusText}`);
  }
}

// Factory function
export function getNotificationAdapter(): NotificationAdapter {
  const provider = process.env.NOTIFICATION_PROVIDER || 'cloudflare';
  if (provider === 'firebase') return new FirebaseNotificationAdapter();
  return new CloudflareNotificationAdapter();
}
