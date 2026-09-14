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
import { reviewRoutes } from './routes/reviews';
import { sessionRoutes } from './routes/sessions';
import { appealRoutes } from './routes/appeals';
import { portfolioRoutes } from './routes/portfolio';
import { authMiddleware } from './middleware/auth';

const app = new Hono();

app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors());

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.route('/api/auth', authRoutes);
app.route('/api/profiles', profileRoutes);
app.route('/api/jobs', jobRoutes);

app.use('/api/*', authMiddleware);
app.route('/api/portfolio', portfolioRoutes);
app.route('/api/proposals', proposalRoutes);
app.route('/api/projects', projectRoutes);
app.route('/api/milestones', milestoneRoutes);
app.route('/api/disputes', disputeRoutes);
app.route('/api/messages', messageRoutes);
app.route('/api/notifications', notificationRoutes);
app.route('/api/uploads', uploadRoutes);
app.route('/api/reviews', reviewRoutes);
app.route('/api/sessions', sessionRoutes);
app.route('/api/appeals', appealRoutes);

app.use('/api/admin/*', authMiddleware);
app.route('/api/admin', adminRoutes);

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, 500);
});

app.notFound((c) => c.json({ error: { code: 'NOT_FOUND', message: 'Resource not found' } }, 404));

export default app;
