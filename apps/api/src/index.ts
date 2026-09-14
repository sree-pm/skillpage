import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { authRoutes } from './routes/auth';
import { profileRoutes } from './routes/profiles';
import { jobRoutes } from './routes/jobs';
import { proposalRoutes } from './routes/proposals';
import { projectRoutes } from './routes/projects';
import { milestoneRoutes } from './routes/milestones';
import { disputeRoutes } from './routes/disputes';
import { messageRoutes } from './routes/messages';
import { notificationRoutes } from './routes/notifications';
import { adminRoutes } from './routes/admin';
import { uploadRoutes } from './routes/uploads';
import { authMiddleware } from './middleware/auth';

const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors());

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Public routes
app.route('/api/auth', authRoutes);
app.route('/api/profiles', profileRoutes);
app.route('/api/jobs', jobRoutes);

// Protected routes (require auth)
app.use('/api/*', authMiddleware);
app.route('/api/proposals', proposalRoutes);
app.route('/api/projects', projectRoutes);
app.route('/api/milestones', milestoneRoutes);
app.route('/api/disputes', disputeRoutes);
app.route('/api/messages', messageRoutes);
app.route('/api/notifications', notificationRoutes);
app.route('/api/uploads', uploadRoutes);

// Admin routes (require admin role)
app.use('/api/admin/*', authMiddleware);
app.route('/api/admin', adminRoutes);

// Error handling
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, 500);
});

// 404 handler
app.notFound((c) => c.json({ error: { code: 'NOT_FOUND', message: 'Resource not found' } }, 404));

export default app;
