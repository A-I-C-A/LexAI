# Deployment Checklist for LegalAxis RAG Integration (Railway)

## Pre-Deployment

- [ ] Ensure you have API keys ready:
  - [ ] Groq API key (https://console.groq.com)
  - [ ] VoyageAI API key (https://www.voyageai.com)
  - [ ] Weaviate cluster credentials (https://console.weaviate.cloud)

- [ ] Test RAG service locally:
  ```bash
  cd RAG
  uvicorn app.main:app --reload --port 8000
  # Visit http://localhost:8000/health
  ```

- [ ] Test scenario analysis locally:
  ```bash
  curl -X POST http://localhost:8000/api/v1/scenario/analyze \
    -H "Content-Type: application/json" \
    -d '{"scenario_description":"Test scenario","scenario_type":"whatif"}'
  ```

## Step 1: Deploy RAG Backend to Railway

### Method A: Railway CLI (Recommended)

```bash
# 1. Install Railway CLI (if not installed)
npm install -g @railway/cli

# 2. Navigate to RAG directory
cd RAG

# 3. Login to Railway
railway login

# 4. Initialize project
railway init

# 5. Set environment variables
railway variables set GROQ_API_KEY=your_groq_key
railway variables set VOYAGE_API_KEY=your_voyage_key
railway variables set WEAVIATE_URL=your_weaviate_url
railway variables set WEAVIATE_API_KEY=your_weaviate_key

# 6. Deploy
railway up

# 7. Get service URL
railway status
```

### Method B: Railway Dashboard

1. **Create Railway Account**
   - [ ] Sign up at https://railway.app
   - [ ] Verify email

2. **Deploy from GitHub**
   - [ ] Go to Railway dashboard
   - [ ] Click **"New Project"** → **"Deploy from GitHub repo"**
   - [ ] Connect your GitHub repository
   - [ ] Select the LegalAxis repository

3. **Configure Service**
   - [ ] Railway auto-detects Python
   - [ ] Root directory: `/RAG` (if needed)
   - [ ] Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2`

4. **Set Environment Variables**
   - [ ] Go to **Variables** tab
   - [ ] Add:
     ```
     GROQ_API_KEY=<your_key>
     VOYAGE_API_KEY=<your_key>
     WEAVIATE_URL=<your_weaviate_url>
     WEAVIATE_API_KEY=<your_key>
     ```

5. **Deploy & Get URL**
   - [ ] Click **Deploy**
   - [ ] Wait 2-5 minutes for build
   - [ ] Go to **Settings** → **Domains** → **Generate Domain**
   - [ ] Copy your service URL (e.g., `https://legalaxis-rag-production.up.railway.app`)

## Step 2: Update Frontend Configuration

### 2.1 Update Environment Variable
- [ ] Open `.env` in project root
- [ ] Update RAG backend URL:
  ```env
  VITE_RAG_BACKEND_URL=https://legalaxis-rag-production.up.railway.app
  ```

### 2.2 Update CORS (if needed)
- [ ] If using custom domain, update `RAG/app/main.py`:
  ```python
  allow_origins=[
      "https://your-frontend-domain.com",
      "https://*.web.app",  # Firebase
      "*"  # Or specific domains only
  ]
  ```
- [ ] Commit and push changes
- [ ] Redeploy on Railway (automatic if GitHub connected)

## Step 3: Deploy Frontend

### Option A: Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

### Option B: Vercel
```bash
npm run build
vercel --prod
```

### Option C: Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## Step 4: Verification

### 4.1 Test Backend
- [ ] Visit `https://your-service.up.railway.app/ping`
- [ ] Should return: `{"status":"ultra-fast","mode":"lightning"}`
- [ ] Test health: `https://your-service.up.railway.app/health`

### 4.2 Test Frontend Integration
- [ ] Open deployed frontend
- [ ] Navigate to Scenarios page
- [ ] Try What-If Engine:
  1. Drag elements to canvas
  2. Click "Analyze Scenario"
  3. Verify AI response appears (should take 3-10 seconds)

### 4.3 Test Other Scenario Types
- [ ] Role Playing simulation
- [ ] Dispute Resolution analysis
- [ ] Probability Outcomes
- [ ] Timeline generation

## Step 5: Monitoring

### 5.1 Railway Dashboard
```bash
# View logs
railway logs

# Check deployment status
railway status

# Open service in browser
railway open
```

### 5.2 Frontend Console
- [ ] Open browser DevTools → Console
- [ ] Check for network errors
- [ ] Verify API calls to RAG backend

## Common Issues & Solutions

### Issue: CORS Error
**Solution**: Update CORS origins in `RAG/app/main.py` to include your frontend domain

### Issue: "railway: command not found"
**Solution**: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Issue: Environment Variables Not Set
**Solution**: 
```bash
railway variables  # List current variables
railway variables set KEY=value  # Add missing ones
```

### Issue: Build Fails
**Solution**: Check Railway logs
```bash
railway logs --deployment
```

### Issue: Service Won't Start
**Solution**: Verify port configuration uses `$PORT`
```bash
# Check railway.json or start command uses $PORT
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Production Optimizations

- [ ] Enable Railway's observability features
- [ ] Set up custom domain (Settings → Networking)
- [ ] Monitor usage in Railway dashboard
- [ ] Add Redis plugin for caching (optional)
- [ ] Set up health check monitoring

## Cost Management

**Railway Pricing**:
- **Free Trial**: $5 credit (one-time)
- **Hobby Plan**: $5/month
  - Includes $5 usage credit
  - Pay-as-you-go beyond credit
  - ~$0.02/hour for this workload

**Expected Monthly Cost**: ~$5-10 for low-medium traffic

**Cost Optimization Tips**:
- Monitor usage dashboard
- Scale down during low traffic
- Use Railway's sleep feature if available

## Rollback Plan

If deployment fails:

### Via CLI:
```bash
railway rollback
```

### Via Dashboard:
1. Go to Deployments tab
2. Click previous successful deployment
3. Click "Redeploy"

### Fallback to Local:
```env
VITE_RAG_BACKEND_URL=http://localhost:8000
```

## Success Criteria

✅ RAG backend deployed on Railway  
✅ Service URL accessible  
✅ Health endpoint returns 200 OK  
✅ Frontend can call RAG API  
✅ Scenario analysis works end-to-end  
✅ Response time < 15 seconds  
✅ No CORS errors  
✅ Logs show successful requests  

## Railway CLI Quick Reference

```bash
railway login          # Authenticate
railway init           # Create new project
railway link           # Link to existing project
railway up             # Deploy current directory
railway logs           # Stream logs
railway status         # Check deployment info
railway variables      # List environment variables
railway variables set  # Add variable
railway open           # Open service URL
railway rollback       # Rollback to previous deployment
railway disconnect     # Unlink project
```

## Post-Deployment Monitoring

### Set Up Alerts (Optional)
1. Railway dashboard → Settings → Notifications
2. Enable deployment notifications
3. Set up Slack/Discord webhooks

### Regular Checks
- [ ] Weekly: Check Railway usage dashboard
- [ ] Monthly: Review costs and optimize
- [ ] After updates: Monitor logs for errors

---

**Deployment Date**: ___________  
**Deployed By**: ___________  
**Railway URL**: ___________  
**Frontend URL**: ___________  
**Estimated Monthly Cost**: $___________  

## Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app
