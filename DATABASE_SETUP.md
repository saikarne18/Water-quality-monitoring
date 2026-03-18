# Database Setup Guide - Task 1

## Prerequisites
- Aiven account (https://aiven.io)
- PostgreSQL free tier service
- pgAdmin (optional, for GUI management)

---

## Step 1: Create Aiven PostgreSQL Service

### 1.1 Sign Up / Login to Aiven
1. Go to https://aiven.io and create free account
2. Verify email
3. Login to dashboard

### 1.2 Create PostgreSQL Service
1. Click **"Create Service"**
2. Select **PostgreSQL**
3. Choose **Cloud Provider**: 
   - Recommended: AWS (Singapore, Frankfurt, or US-East)
4. Choose **Service Plan**: 
   - Select "Hobbyist" (Free tier)
5. **Service Name**: `water-monitor-db` (or preferred name)
6. Click **"Create Service"**

### 1.3 Wait for Service to Be Ready
- Status shows "Building..." → "Running"
- Takes about 2-3 minutes
- You'll receive email confirmation

---

## Step 2: Get Connection Details

### 2.1 From Aiven Dashboard
1. Click on your PostgreSQL service
2. Go to **"Connection Information"** tab
3. Note down these details:
   - **Host**: `pg-xxxx.aivencloud.com`
   - **Port**: `13296` (usually)
   - **Database**: `defaultdb`
   - **Username**: `avnadmin`
   - **Password**: Click "View" to reveal

### 2.2 Take Screenshot
- Capture the connection information for submission
- IMPORTANT: **Do NOT share password publicly**

---

## Step 3: Configure Backend

### 3.1 Create `.env` File
```bash
cd backend
cp .env.template .env
```

### 3.2 Update `.env` with Your Values
Edit `backend/.env`:
```env
DB_HOST=pg-xxxx.aivencloud.com
DB_PORT=13296
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=your-actual-password
DB_SSLMODE=require

ENVIRONMENT=development
DEBUG=true

SECRET_KEY=your-random-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
```

---

## Step 4: Test Database Connection

### 4.1 Install psycopg2 (if not already)
```bash
pip install psycopg2-binary python-dotenv
```

### 4.2 Test Connection
```bash
cd backend
python3 -c "
from main import get_connection
try:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT version();')
    version = cursor.fetchone()
    print('✓ Connected Successfully!')
    print('PostgreSQL Version:', version)
    cursor.close()
    conn.close()
except Exception as e:
    print('✗ Connection Failed:', str(e))
"
```

### 4.3 Expected Output
```
✓ Connected Successfully!
PostgreSQL Version: ('PostgreSQL 13.x.x on xxx')
```

---

## Step 5: Initialize Database Tables

### 5.1 Run Table Creation
The application automatically creates tables on first run, but you can manually trigger it:

```bash
python3 -c "
from main import create_tables
create_tables()
print('✓ Tables created successfully!')
"
```

### 5.2 Verify Tables Created
```bash
python3 -c "
from main import get_connection
conn = get_connection()
cursor = conn.cursor()
cursor.execute('''
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema='public'
')
tables = cursor.fetchall()
print('✓ Tables in database:')
for table in tables:
    print(f'  - {table[0]}')
cursor.close()
conn.close()
"
```

### 5.3 Expected Tables
```
✓ Tables in database:
  - users
  - predictions
  - alert_preferences
  - alert_history
  - tank_sensor_config
  - sensor_data_logs
```

---

## Step 6: Verify Database Schema

### Option A: Using psql Command Line
```bash
# Connect to database
psql -h pg-xxxx.aivencloud.com -p 13296 -U avnadmin -d defaultdb

# In psql prompt, run:
\dt              # List all tables
\d users         # Describe users table
\q              # Quit
```

### Option B: Using pgAdmin Web UI
1. Go to https://pgadmin.aiven.cloud (if using Aiven's pgAdmin)
2. Add connection with your details
3. Browse tables and columns

### Option C: Python Script
```python
# verify_db.py
import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

conn = psycopg2.connect(
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT'),
    database=os.getenv('DB_NAME'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    sslmode=os.getenv('DB_SSLMODE')
)

cursor = conn.cursor()

# Get all tables
cursor.execute("""
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema='public' ORDER BY table_name
""")

print("Tables in database:")
for table in cursor.fetchall():
    print(f"\n  Table: {table[0]}")
    cursor.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name='{table[0]}'")
    for col in cursor.fetchall():
        print(f"    - {col[0]}: {col[1]}")

cursor.close()
conn.close()
```

---

## Step 7: Take Screenshot for Submission

### Required Screenshots
1. **Aiven Dashboard** showing your PostgreSQL service running
2. **Connection Information** page with host, port, database details
3. **Terminal Output** showing successful database connection test
4. **pgAdmin or psql** showing tables in database

---

## Troubleshooting

### Connection Refused
```
Error: could not connect to server: Connection refused
```
**Solution:**
- Check if Aiven service is "Running" status
- Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD are correct
- Check firewall settings
- Try accessing from IP whitelist settings in Aiven

### SSL Error
```
Error: FATAL: sslmode "require" but no SSL support in libpq
```
**Solution:**
```bash
pip install --upgrade psycopg2-binary
# OR use: pip install psycopg2-binary=2.9.3
```

### Authentication Failed
```
Error: FATAL: password authentication failed for user "avnadmin"
```
**Solution:**
- Re-check password in Aiven dashboard
- Copy password carefully (special characters!)
- Click "Reset Password" in Aiven if forgotten

### Table Creation Failed
**Solution:**
```bash
# Run with explicit error handling
python3 -c "
from main import create_tables
try:
    create_tables()
    print('Tables created')
except Exception as e:
    import traceback
    traceback.print_exc()
"
```

---

## Security Best Practices

✓ **DO:**
- Keep `.env` file in `.gitignore`
- Use strong passwords (20+ characters)
- Rotate passwords periodically
- Use SSL connection (sslmode=require)
- Limit database user permissions in production

✗ **DON'T:**
- Commit `.env` file to git
- Share password with others
- Use default/simple passwords
- Store credentials in code
- Disable SSL in production

---

## Next Steps

After successful database setup:

1. ✓ Complete Step 1 of TASK.md
2. → Proceed to Task 2: Backend API Modifications
3. → Verify endpoints work with database
4. → Deploy to cloud (Render)

---

**Submission Checklist**:
- [ ] Screenshot of Aiven PostgreSQL service running
- [ ] Screenshot of connection information
- [ ] Screenshot of successful connection test
- [ ] Screenshot of tables in database
- [ ] `.env` file configured (NOT committed to git)

---

*Last Updated: March 18, 2026*
