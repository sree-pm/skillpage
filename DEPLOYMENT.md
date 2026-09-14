# SkillPage Deployment Runbook

## Prerequisites

- Cloudflare account with Pro plan (for Workers, D1, R2, Queues)
- Node.js >= 18.17
- Wrangler CLI (`npm i -g wrangler`)
- GitHub account (for CI/CD)

## 1. Cloudflare Resource Setup

### Create D1 Database
```bash
wrangler d1 create skillpage-db
# Copy the database_id from output
```

### Create R2 Bucket
```bash
wrangler r2 bucket create skillpage-files
```

### Create Queue
```bash
wrangler queues create skillpage-email-queue
```

### Configure Turnstile (optional)
- Go to Cloudflare Dashboard > Turnstile
- Create a new sitekey for `skillpage.io`
- Copy the sitekey and secret

## 2. Update Configuration

### apps/api/wrangler.toml
Replace `YOUR_D1_DATABASE_ID_HERE` with the actual D1 database ID from step 1.

### Set Secrets
```bash
cd apps/api
wrangler secret put JWT_SECRET
wrangler secret put STRIPE_SECRET_KEY  # Use sk_test_... for development
wrangler secret put TURNSTILE_SECRET
```

## 3. Run Migrations

### Local Development
```bash
cd apps/api
npm run db:migrate:local
```

### Production
```bash
cd apps/api
npm run db:migrate:remote
```

## 4. Deploy API

### Manual Deploy
```bash
cd apps/api
wrangler deploy
```

### GitHub Actions (Manual Trigger)
1. Go to GitHub repo > Actions > "Deploy (Manual)"
2. Click "Run workflow"
3. Check "Deploy to production"
4. Click "Run workflow"

## 5. Deploy Frontend

### Build for Cloudflare Pages
```bash
cd apps/web
npm install
npx @cloudflare/next-on-pages
```

### Deploy to Pages
```bash
wrangler pages deploy .vercel/output/static --project-name=skillpage
```

Or use GitHub Actions (same workflow as API deploy).

## 6. Post-Deployment Checklist

- [ ] API health: `https://skillpage-api.<subdomain>.workers.dev/health`
- [ ] Frontend loads: `https://skillpage.<pages-subdomain>.pages.dev`
- [ ] Signup works and creates user in D1
- [ ] Login returns JWT token
- [ ] Job creation works (authenticated)
- [ ] File uploads to R2 work
- [ ] Email queue consumer is running (if implemented)

## 7. Custom Domain (Optional)

### Frontend
- Cloudflare Pages > skillpage > Custom domains > Add custom domain
- Enter `skillpage.io` or subdomain

### API
- Cloudflare Workers > skillpage-api > Triggers > Add custom domain
- Enter `api.skillpage.io`

Update `apps/web/.env.local` and redeploy with `NEXT_PUBLIC_API_URL=https://api.skillpage.io`

## 8. Monitoring

### Logs
```bash
wrangler tail --format pretty  # API logs
```

### D1 Queries
```bash
wrangler d1 execute skillpage-db --remote --command "SELECT COUNT(*) FROM users;"
```

### R2 Objects
```bash
wrangler r2 object list skillpage-files
```

## Troubleshooting

### Worker fails to deploy
- Check `wrangler.toml` for syntax errors
- Ensure all secrets are set (`wrangler secret list`)
- Check build logs for TypeScript errors

### Database migration fails
- Ensure D1 database ID is correct in `wrangler.toml`
- Check SQL syntax in migration file
- Run `wrangler d1 execute skillpage-db --remote --command ".tables"` to verify tables

### Frontend build fails
- Ensure all dependencies are installed (`npm install` at root)
- Check `next.config.js` for Cloudflare Pages compatibility
- Clear `.vercel` and `node_modules` and rebuild
