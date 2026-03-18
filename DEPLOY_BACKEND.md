# Deployment Configuration for Backend (Render)

Create a new Web Service on Render.com with the following settings:

## Basic Settings
- **Name**: water-monitor-backend (or your preferred name)
- **Runtime**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Region**: Choose closest to your users (e.g., Singapore, Frankfurt)

## Root Directory
- Set to: `backend`

## Environment Variables
Add the following environment variables in Render dashboard:

```
DB_HOST=<your-aiven-host>
DB_PORT=<your-aiven-port>
DB_NAME=<your-database-name>
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_SSLMODE=require

ENVIRONMENT=production
DEBUG=false

SECRET_KEY=<generate-strong-random-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASSWORD=<your-app-password>
SMTP_FROM=<your-email>

APP_NAME=Water Monitor System
APP_VERSION=1.0.0
```

## Build Settings
- **Auto-Deploy**: Yes (on git push)
- **Keep alive URL**: https://your-service.onrender.com/api/v1/health

## Important Notes
1. The service will restart after deployment
2. Note the Service URL provided by Render (e.g., https://water-monitor-backend.onrender.com)
3. Use this URL as API_BASE_URL in frontend configuration

## Monitoring
- View logs in Render dashboard
- Set up email alerts for deployment failures
- Monitor database connections to Aiven

## Troubleshooting
If deployment fails:
1. Check build logs for Python package errors
2. Verify all environment variables are set
3. Test database connection: `python -c "import psycopg2; import sys; print('OK')"`
4. Check requirements.txt for TensorFlow - may need to use tensorflow-cpu for smaller servers
