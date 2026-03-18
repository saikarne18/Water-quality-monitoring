# Deployment Configuration for Frontend (Vercel)

Deploy your React frontend to Vercel for free hosting with automatic deployments.

## Pre-deployment Setup

### 1. Create GitHub Repository
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. Build Locally (Optional Test)
```bash
npm run build
# Check build/ folder for output
```

### 3. Create .env.production
Create `frontend/.env.production` with:
```
REACT_APP_API_BASE_URL=https://your-backend-api.onrender.com
REACT_APP_ENV=production
```

## Deploy to Vercel

### Step 1: Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub account
- Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click "New Project"
2. Import your GitHub repository
3. Select `frontend` folder as root directory
4. Add Environment Variables:
   ```
   REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com
   REACT_APP_ENV=production
   ```

### Step 3: Configure Build Settings
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build completion
3. Get your deployment URL (e.g., https://water-monitor.vercel.app)

## Post-deployment

### 1. Update Backend CORS
Ensure backend allows your Vercel URL:
```python
# In backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://water-monitor.vercel.app", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Configure Custom Domain (Optional)
1. In Vercel project settings
2. Go to Domains section
3. Add your custom domain
4. Update DNS records as instructed

### 3. Set Up Continuous Deployment
- Vercel automatically deploys on git push to main branch
- View deployment history in Vercel dashboard
- Revert to previous deployments if needed

## Troubleshooting

### Build Fails
- Check Node.js version: `node -v` (should be 14+)
- Clear cache: Delete node_modules and package-lock.json
- Reinstall: `npm install`

### API Connection Issues
- Verify REACT_APP_API_BASE_URL in .env.production
- Check backend CORS settings
- Use Backend URL from Render dashboard

### Environment Variables Not Loading
- Redeploy after adding env vars
- Check "Environment" tab in Vercel project settings
- Restart deployment

## Deployment Checklist

- [ ] GitHub repo set up with frontend folder
- [ ] Backend deployed to Render and has URL
- [ ] .env.production configured with correct API URL
- [ ] Vercel project created and linked to GitHub
- [ ] Build succeeds on Vercel
- [ ] Frontend loads and can reach backend API
- [ ] All features work (auth, predictions, realtime)
- [ ] Dark mode works
- [ ] Responsive design verified on mobile

## Next Steps After Deployment

1. Test live application at your Vercel URL
2. Verify all API endpoints work
3. Test login/signup flow
4. Check WebSocket real-time predictions
5. Test CSV upload feature
6. Verify email alerts function
7. Share deployment URL with stakeholders
