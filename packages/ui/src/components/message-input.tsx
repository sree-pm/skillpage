'use client';
import { useState } from 'react';
import { Input, Button, toast } from '.';

interface MessageInputProps {
  projectId: string;
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
}

export function MessageInput({ projectId, onSend, disabled }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    try {
      await onSend(content);
      setContent('');
      toast.success('Message sent');
    } catch (err: any) {
      toast.error(`Failed to send: ${err.message}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled || sending}
        className="flex-1"
      />
      <Button type="submit" disabled={!content.trim() || sending || disabled}>
        {sending ? 'Sending...' : 'Send'}
      </Button>
    </form>
  );
}
