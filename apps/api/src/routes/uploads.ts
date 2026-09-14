import { Hono } from 'hono';
import { z } from 'zod';

const signUploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  contentType: z.string(),
});

export const uploadRoutes = new Hono();

uploadRoutes.post('/sign', async (c) => {
  try {
    const body = await c.req.json();
    const { fileName, contentType } = signUploadSchema.parse(body);
    const key = `uploads/${crypto.randomUUID()}-${fileName}`;
    const url = await c.env.FILES.createSignedURL(key, { expiresIn: 300, method: 'PUT', contentType });
    return c.json({ uploadUrl: url, key, publicUrl: `https://skillpage-files.r2.dev/${key}` });
  } catch (err: any) {
    if (err instanceof z.ZodError) return c.json({ error: { code: 'VALIDATION_ERROR', message: err.errors[0].message } }, 400);
    console.error('Sign upload error:', err);
    return c.json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to generate signed URL' } }, 500);
  }
});
