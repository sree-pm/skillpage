export interface MessagingAdapter {
  sendMessage(roomId: string, userId: string, content: string): Promise<void>;
  getMessages(roomId: string, limit?: number): Promise<any[]>;
  subscribe(roomId: string, callback: (message: any) => void): () => void;
}

// Cloudflare Durable Objects adapter (zero cost, real-time)
export class DurableObjectMessagingAdapter implements MessagingAdapter {
  async sendMessage(roomId: string, userId: string, content: string): Promise<void> {
    // Store in D1 for persistence
    const db = (global as any).DB;
    const messageId = crypto.randomUUID();
    await db.prepare('INSERT INTO messages (id, project_id, sender_id, content, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(messageId, roomId, userId, content, new Date().toISOString()).run();
    
    // Broadcast via Durable Object WebSocket (stub - implement DO for real-time)
    console.log(`Message sent to room ${roomId} by ${userId}`);
  }

  async getMessages(roomId: string, limit: number = 50): Promise<any[]> {
    const db = (global as any).DB;
    const result = await db.prepare('SELECT * FROM messages WHERE project_id = ? ORDER BY created_at DESC LIMIT ?').bind(roomId, limit).all();
    return result.results.reverse();
  }

  subscribe(roomId: string, callback: (message: any) => void): () => void {
    // Polling fallback (replace with Durable Objects WebSocket in production)
    const interval = setInterval(async () => {
      const messages = await this.getMessages(roomId, 10);
      messages.forEach(callback);
    }, 3000);
    return () => clearInterval(interval);
  }
}

// Telnyx adapter (paid, for SMS/MMS if needed)
export class TelnyxMessagingAdapter implements MessagingAdapter {
  async sendMessage(roomId: string, userId: string, content: string): Promise<void> {
    // Use Telnyx Messaging API for SMS
    const response = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.TELNYX_PHONE_NUMBER,
        to: userId, // User's phone number
        text: content,
      }),
    });
    if (!response.ok) throw new Error(`Failed to send SMS: ${response.statusText}`);
  }

  async getMessages(): Promise<any[]> { return []; }
  subscribe(): () => void { return () => {}; }
}

// Factory function
export function getMessagingAdapter(): MessagingAdapter {
  const provider = process.env.MESSAGING_PROVIDER || 'durable-object';
  if (provider === 'telnyx') return new TelnyxMessagingAdapter();
  return new DurableObjectMessagingAdapter();
}
