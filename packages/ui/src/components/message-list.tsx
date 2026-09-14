'use client';
import { useEffect, useState, useRef } from 'react';
import { SkeletonText } from './skeleton';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  sender_id: string;
  sender_email?: string;
  content: string;
  created_at: string;
}

interface MessageListProps {
  projectId: string;
  currentUserId: string;
  className?: string;
}

export function MessageList({ projectId, currentUserId, className }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/messages?projectId=${projectId}`,
        {
          headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}` },
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to load messages');
      setMessages(json.messages || []);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonText key={i} lines={2} className={cn(i % 2 === 0 ? 'ml-auto w-2/3' : 'w-2/3')} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('text-center py-8 text-error', className)}>
        <p>Failed to load messages: {error}</p>
        <button onClick={fetchMessages} className="mt-2 text-primary hover:underline text-sm">
          Try again
        </button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={cn('text-center py-8 text-text-secondary', className)}>
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {messages.map(message => (
        <div
          key={message.id}
          className={cn(
            'flex',
            message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
          )}
        >
          <div
            className={cn(
              'max-w-[70%] rounded-lg p-3',
              message.sender_id === currentUserId
                ? 'bg-primary text-white'
                : 'bg-surface text-text-primary'
            )}
          >
            {message.sender_id !== currentUserId && message.sender_email && (
              <p className="text-xs font-medium mb-1 opacity-75">{message.sender_email}</p>
            )}
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            <p className={cn('text-xs mt-1', message.sender_id === currentUserId ? 'opacity-75' : 'text-text-muted')}>
              {new Date(message.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
