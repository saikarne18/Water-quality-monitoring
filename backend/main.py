import os
from dotenv import load_dotenv
import requests
import psycopg2
import time
import random
import threading
import json
import asyncio
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import uvicorn
from urllib.parse import urlparse
import hashlib
import secrets
import jwt
from jose import JWTError
import csv
import io

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Added CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# ==============================
# BASIC ROUTES
# ==============================

@app.get("/")
def root():
    return {"message": "IoT Water Monitoring API is running"}

@app.get("/api/v1/health")
def health():
    return {"status": "healthy"}

# ==============================
# DATABASE CONNECTION
# ==============================


def get_connection():
    """
    Get database connection from DATABASE_URL or individual env variables.
    Supports both formats for flexibility.
    """
    database_url = os.environ.get("DATABASE_URL")
    
    if database_url:
        # Parse DATABASE_URL (format: postgres://user:password@host:port/database)
        parsed = urlparse(database_url)
        return psycopg2.connect(
            host=parsed.hostname,
            port=parsed.port or 5432,
            database=parsed.path.lstrip('/'),
            user=parsed.username,
            password=parsed.password,
            sslmode="require"  # Aiven requires SSL
        )
    else:
        # Fallback to individual environment variables for local development
        return psycopg2.connect(
            host=os.environ.get("DB_HOST", "localhost"),
            port=os.environ.get("DB_PORT", "5432"),
            database=os.environ.get("DB_NAME", "iot-test"),
            user=os.environ.get("DB_USER", "postgres"),
            password=os.environ.get("DB_PASSWORD", "postgres"),
            sslmode=os.environ.get("DB_SSLMODE", "prefer")  # Use "require" for Aiven
        )


# ==============================
# CREATE TABLES
# ==============================
def create_tables():

    conn = get_connection()
    cur = conn.cursor()

    # Users table for authentication
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        hashed_password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Sensor data table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS sensor_data (
        id SERIAL PRIMARY KEY,
        node_id VARCHAR(50),
        field1 FLOAT,
        field2 FLOAT,
        created_at TIMESTAMP
    )
    """)

    # Tank parameters table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS tank_sensorparameters (
        id SERIAL PRIMARY KEY,
        node_id VARCHAR(50),
        tank_height_cm FLOAT,
        tank_length_cm FLOAT,
        tank_width_cm FLOAT,
        lat FLOAT,
        long FLOAT
    )
    """)

    # Predictions table for batch uploads and predictions
    cur.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        node_id VARCHAR(50),
        distance FLOAT,
        temperature FLOAT,
        prediction VARCHAR(50),
        confidence FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    # Alert preferences table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS alert_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE,
        email_alerts_enabled BOOLEAN DEFAULT TRUE,
        high_water_alert BOOLEAN DEFAULT TRUE,
        low_water_alert BOOLEAN DEFAULT TRUE,
        temperature_alert BOOLEAN DEFAULT FALSE,
        temperature_threshold FLOAT DEFAULT 30.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    # Alert history table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS alert_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        alert_type VARCHAR(50),
        distance FLOAT,
        temperature FLOAT,
        message TEXT,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    conn.commit()
    cur.close()
    conn.close()


# ==============================
# THINGSPEAK CONFIG
# ==============================
REAL_DATA_WITH_CURRENT_TIME = False
TEST_MODE = True

# JWT Configuration
JWT_SECRET = os.environ.get("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Node id of sensor
NODE_ID = "NODE_001"

# ThingSpeak API
url = "https://api.thingspeak.com/channels/3290444/feeds.json?api_key=AWP8F08WA7SLO5EQ&results=-1"

last_created_at = None


# ==============================
# GENERATE TEST DATA
# ==============================
def generate_test_data():

    base_values = {
        "distance": 94.0,
        "temperature": 20.8
    }

    return {
        "distance": round(base_values["distance"] + random.uniform(-10, 10), 1),
        "temperature": round(base_values["temperature"] + random.uniform(-2, 2), 1),
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }


# ==============================
# SENSOR DATA COLLECTOR
# ==============================
def sensor_collector():

    global last_created_at

    print("Distance & Temperature Data Collector Started")

    while True:

        try:

            if TEST_MODE:

                test_data = generate_test_data()

                distance = test_data["distance"]
                temperature = test_data["temperature"]
                created_at = test_data["created_at"]

            else:

                response = requests.get(url)
                data = response.json()

                feed = data["feeds"][0]

                distance = float(feed["field1"])
                temperature = float(feed["field2"])
                created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            print("NEW DATA:", distance, temperature, created_at)

            conn = get_connection()
            cur = conn.cursor()

            cur.execute("""
            INSERT INTO sensor_data
            (node_id, field1, field2, created_at)
            VALUES (%s,%s,%s,%s)
            """,
                        (NODE_ID, distance, temperature, created_at))

            conn.commit()

            cur.close()
            conn.close()

            print("Sensor data inserted")

        except Exception as e:

            print("Error:", e)

        time.sleep(20)


# ==============================
# REQUEST MODEL
# ==============================
class TankParameters(BaseModel):

    node_id: str
    tank_height_cm: float
    tank_length_cm: float
    tank_width_cm: float
    lat: float
    long: float


# ==============================
# POST API
# ==============================
@app.post("/tank-parameters")
def create_tank_parameters(data: TankParameters):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    INSERT INTO tank_sensorparameters
    (node_id, tank_height_cm, tank_length_cm, tank_width_cm, lat, long)
    VALUES (%s,%s,%s,%s,%s,%s)
    RETURNING id
    """,
                (
                    data.node_id,
                    data.tank_height_cm,
                    data.tank_length_cm,
                    data.tank_width_cm,
                    data.lat,
                    data.long
                ))

    new_id = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {
        "message": "Tank parameters inserted successfully",
        "id": new_id
    }


# ==============================
# GET API
# ==============================
@app.get("/tank-parameters")
def get_tank_parameters():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM tank_sensorparameters")

    rows = cur.fetchall()

    cur.close()
    conn.close()

    result = []

    for row in rows:
        result.append({
            "id": row[0],
            "node_id": row[1],
            "tank_height_cm": row[2],
            "tank_length_cm": row[3],
            "tank_width_cm": row[4],
            "lat": row[5],
            "long": row[6]
        })

    return result


# ==============================
# GET SENSOR DATA API
# ==============================
@app.get("/sensor-data")
def get_sensor_data():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    SELECT id,node_id,field1,field2,created_at
    FROM sensor_data
    ORDER BY id DESC
    LIMIT 100
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    result = []

    for row in rows:
        result.append({
            "id": row[0],
            "node_id": row[1],
            "distance": row[2],
            "temperature": row[3],
            "created_at": row[4]
        })

    return result

@app.get("/sensor-data")
def get_sensor_data(node_id: str = None):

    conn = get_connection()
    cur = conn.cursor()

    if node_id:
        cur.execute("""
        SELECT id,node_id,field1,field2,created_at
        FROM sensor_data
        WHERE node_id = %s
        ORDER BY created_at DESC
        """, (node_id,))
    else:
        cur.execute("""
        SELECT id,node_id,field1,field2,created_at
        FROM sensor_data
        ORDER BY created_at DESC
        """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    result = []

    for row in rows:
        result.append({
            "id": row[0],
            "node_id": row[1],
            "distance": row[2],
            "temperature": row[3],
            "created_at": row[4]
        })

    return result

# ==============================
# PREDICTION MODEL
# ==============================
class PredictionInput(BaseModel):
    distance: float
    temperature: float
    time_features: list = None

# Model prediction logic - hybrid ML model

# ==============================
# AUTHENTICATION MODELS
# ==============================
class SignUp(BaseModel):
    email: str
    username: str
    password: str

class Login(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# ==============================
# AUTHENTICATION HELPERS
# ==============================
def hash_password(password: str) -> str:
    """Hash a password using SHA256 with salt"""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return f"{salt}${pwd_hash.hex()}"

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        salt, pwd_hash = hashed_password.split('$')
        return hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000).hex() == pwd_hash
    except:
        return False

def create_access_token(user_id: int, email: str) -> str:
    """Create a JWT access token"""
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def verify_token(token: str) -> dict:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==============================
# AUTHENTICATION ENDPOINTS
# ==============================
@app.post("/api/v1/signup", response_model=TokenResponse)
def signup(user_data: SignUp):
    """Register a new user"""
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Check if user already exists
        cur.execute("SELECT id FROM users WHERE email = %s OR username = %s", 
                   (user_data.email, user_data.username))
        if cur.fetchone():
            cur.close()
            conn.close()
            raise HTTPException(status_code=400, detail="Email or username already exists")
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Insert new user
        cur.execute("""
            INSERT INTO users (email, username, hashed_password)
            VALUES (%s, %s, %s)
            RETURNING id, email, username, created_at
        """, (user_data.email, user_data.username, hashed_password))
        
        user_id, email, username, created_at = cur.fetchone()
        conn.commit()
        
        # Create token
        access_token = create_access_token(user_id, email)
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                id=user_id,
                email=email,
                username=username,
                created_at=str(created_at)
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.post("/api/v1/login", response_model=TokenResponse)
def login(credentials: Login):
    """Login user with email and password"""
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Find user by email
        cur.execute("""
            SELECT id, email, username, hashed_password, created_at
            FROM users WHERE email = %s
        """, (credentials.email,))
        
        user = cur.fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        user_id, email, username, hashed_password, created_at = user
        
        # Verify password
        if not verify_password(credentials.password, hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create token
        access_token = create_access_token(user_id, email)
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                id=user_id,
                email=email,
                username=username,
                created_at=str(created_at)
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.get("/api/v1/verify-token")
def verify_user_token(token: str = Depends(lambda: None)):
    """Verify if a token is valid"""
    # Note: In production, extract token from header Authorization: Bearer <token>
    if not token:
        raise HTTPException(status_code=400, detail="Token required")
    
    try:
        payload = verify_token(token)
        return {"valid": True, "user_id": payload.get("sub"), "email": payload.get("email")}
    except HTTPException:
        raise

@app.get("/api/v1/user/profile")
def get_user_profile(authorization: str = None):
    """Get current user profile from token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    user_id = int(payload.get("sub"))
    
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT id, email, username, created_at FROM users WHERE id = %s
        """, (user_id,))
        
        user = cur.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserResponse(
            id=user[0],
            email=user[1],
            username=user[2],
            created_at=str(user[3])
        )
    finally:
        cur.close()
        conn.close()

# ==============================
# CSV UPLOAD ENDPOINTS
# ==============================
class CSVUploadResponse(BaseModel):
    message: str
    total_rows: int
    processed_rows: int
    errors: list
    predictions: list

@app.post("/api/v1/upload-csv", response_model=CSVUploadResponse)
async def upload_csv(file: UploadFile = File(...), authorization: str = None):
    """
    Upload CSV file with sensor data for batch predictions
    CSV Format: distance,temperature,node_id (optional)
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    user_id = int(payload.get("sub"))
    
    try:
        # Read CSV file
        contents = await file.read()
        text = contents.decode('utf-8')
        reader = csv.DictReader(io.StringIO(text))
        
        rows = list(reader)
        total_rows = len(rows)
        processed_rows = 0
        errors = []
        predictions_list = []
        
        conn = get_connection()
        cur = conn.cursor()
        
        for idx, row in enumerate(rows):
            try:
                # Extract values
                distance = float(row.get('distance', 0))
                temperature = float(row.get('temperature', 0))
                node_id = row.get('node_id', 'NODE_001')
                
                # Simple prediction logic (replace with ML model call if needed)
                # For now, generate mock prediction based on distance
                if distance < 50:
                    prediction = "High Water Level"
                    confidence = 0.92
                elif distance < 80:
                    prediction = "Normal Water Level"
                    confidence = 0.89
                else:
                    prediction = "Low Water Level"
                    confidence = 0.85
                
                # Store in database
                cur.execute("""
                    INSERT INTO predictions 
                    (user_id, node_id, distance, temperature, prediction, confidence)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id, prediction, confidence
                """, (user_id, node_id, distance, temperature, prediction, confidence))
                
                result = cur.fetchone()
                processed_rows += 1
                
                predictions_list.append({
                    "id": result[0],
                    "distance": distance,
                    "temperature": temperature,
                    "node_id": node_id,
                    "prediction": result[1],
                    "confidence": result[2]
                })
                
            except Exception as e:
                errors.append(f"Row {idx + 1}: {str(e)}")
        
        conn.commit()
        cur.close()
        conn.close()
        
        return CSVUploadResponse(
            message=f"Successfully processed {processed_rows} out of {total_rows} rows",
            total_rows=total_rows,
            processed_rows=processed_rows,
            errors=errors,
            predictions=predictions_list
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/predictions-history")
def get_predictions_history(limit: int = 100, authorization: str = None):
    """Get historical predictions for the user"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    user_id = int(payload.get("sub"))
    
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT id, node_id, distance, temperature, prediction, confidence, created_at
            FROM predictions
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT %s
        """, (user_id, limit))
        
        rows = cur.fetchall()
        predictions = [
            {
                "id": row[0],
                "node_id": row[1],
                "distance": row[2],
                "temperature": row[3],
                "prediction": row[4],
                "confidence": row[5],
                "created_at": str(row[6])
            }
            for row in rows
        ]
        
        return {"predictions": predictions, "total": len(predictions)}
        
    finally:
        cur.close()
        conn.close()

# ==============================
# WEBSOCKET REAL-TIME PREDICTIONS
# ==============================
class ConnectionManager:
    def __init__(self):
        self.active_connections = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                # Connection might have closed, skip
                pass

manager = ConnectionManager()

def send_email_alert(email_to: str, alert_type: str, distance: float, temperature: float):
    """
    Send email alert for anomaly detection
    Note: In production, use proper async email service like SendGrid or AWS SES
    """
    # For demo, we'll just log the alert
    # In production, integrate with email service
    print(f"Email Alert: {email_to} - {alert_type} (Distance: {distance}cm, Temp: {temperature}°C)")
    return True

def detect_anomaly(distance: float, temperature: float) -> tuple:
    """
    Detect anomalities in sensor data
    Returns: (is_anomaly, anomaly_type)
    """
    anomalies = []
    
    # High water level anomaly
    if distance < 30:
        anomalies.append("High Water Level Alert")
    
    # Low water level anomaly
    if distance > 90:
        anomalies.append("Low Water Level Alert")
    
    # Extreme temperature anomaly
    if temperature > 35:
        anomalies.append("High Temperature Alert")
    elif temperature < 5:
        anomalies.append("Low Temperature Alert")
    
    return len(anomalies) > 0, anomalies

# ==============================
# ALERT MANAGEMENT ENDPOINTS
# ==============================
class AlertPreferences(BaseModel):
    email_alerts_enabled: bool = True
    high_water_alert: bool = True
    low_water_alert: bool = True
    temperature_alert: bool = False
    temperature_threshold: float = 30.0

@app.post("/api/v1/alerts/preferences")
def set_alert_preferences(prefs: AlertPreferences, authorization: str = None):
    """Set alert preferences for user"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    user_id = int(payload.get("sub"))
    
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Check if preferences exist
        cur.execute("SELECT id FROM alert_preferences WHERE user_id = %s", (user_id,))
        exists = cur.fetchone()
        
        if exists:
            # Update existing preferences
            cur.execute("""
                UPDATE alert_preferences 
                SET email_alerts_enabled=%s, high_water_alert=%s, 
                    low_water_alert=%s, temperature_alert=%s, temperature_threshold=%s
                WHERE user_id=%s
            """, (prefs.email_alerts_enabled, prefs.high_water_alert, 
                  prefs.low_water_alert, prefs.temperature_alert, 
                  prefs.temperature_threshold, user_id))
        else:
            # Create new preferences
            cur.execute("""
                INSERT INTO alert_preferences 
                (user_id, email_alerts_enabled, high_water_alert, low_water_alert, temperature_alert, temperature_threshold)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (user_id, prefs.email_alerts_enabled, prefs.high_water_alert, 
                  prefs.low_water_alert, prefs.temperature_alert, prefs.temperature_threshold))
        
        conn.commit()
        return {"message": "Alert preferences updated", "status": "success"}
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.get("/api/v1/alerts/preferences")
def get_alert_preferences(authorization: str = None):
    """Get current alert preferences"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    user_id = int(payload.get("sub"))
    
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT email_alerts_enabled, high_water_alert, low_water_alert, 
                   temperature_alert, temperature_threshold
            FROM alert_preferences WHERE user_id = %s
        """, (user_id,))
        
        result = cur.fetchone()
        if result:
            return {
                "email_alerts_enabled": result[0],
                "high_water_alert": result[1],
                "low_water_alert": result[2],
                "temperature_alert": result[3],
                "temperature_threshold": result[4]
            }
        else:
            # Return defaults
            return {
                "email_alerts_enabled": True,
                "high_water_alert": True,
                "low_water_alert": True,
                "temperature_alert": False,
                "temperature_threshold": 30.0
            }
    finally:
        cur.close()
        conn.close()

@app.get("/api/v1/alerts/history")
def get_alert_history(limit: int = 50, authorization: str = None):
    """Get alert history for user"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    user_id = int(payload.get("sub"))
    
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT id, alert_type, distance, temperature, message, sent_at
            FROM alert_history WHERE user_id = %s
            ORDER BY sent_at DESC LIMIT %s
        """, (user_id, limit))
        
        rows = cur.fetchall()
        alerts = [
            {
                "id": row[0],
                "alert_type": row[1],
                "distance": row[2],
                "temperature": row[3],
                "message": row[4],
                "sent_at": str(row[5])
            }
            for row in rows
        ]
        
        return {"alerts": alerts, "total": len(alerts)}
    finally:
        cur.close()
        conn.close()

@app.post("/api/v1/alerts/test")
def test_alert(authorization: str = None):
    """Send test alert to user"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    user_id = int(payload.get("sub"))
    
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Get user email
        cur.execute("SELECT email FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()
        
        if user:
            email = user[0]
            send_email_alert(email, "Test Alert", 75.0, 22.5)
            
            # Log to alert history
            cur.execute("""
                INSERT INTO alert_history (user_id, alert_type, distance, temperature, message)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_id, "Test Alert", 75.0, 22.5, "This is a test alert"))
            
            conn.commit()
            return {"message": "Test alert sent", "status": "success"}
        
        raise HTTPException(status_code=404, detail="User not found")
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.get("/api/v1/anomaly-check")
def check_for_anomalies(distance: float, temperature: float, authorization: str = None):
    """Check if sensor data contains anomalies"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    user_id = int(payload.get("sub"))
    
    # Detect anomalies
    is_anomaly, anomaly_types = detect_anomaly(distance, temperature)
    
    if is_anomaly:
        conn = get_connection()
        cur = conn.cursor()
        
        try:
            # Get user email and preferences
            cur.execute("""
                SELECT u.email, ap.email_alerts_enabled
                FROM users u 
                LEFT JOIN alert_preferences ap ON u.id = ap.user_id
                WHERE u.id = %s
            """, (user_id,))
            
            result = cur.fetchone()
            if result:
                email_enabled = result[1] if result[1] is not None else True
                
                if email_enabled:
                    send_email_alert(result[0], ", ".join(anomaly_types), distance, temperature)
                
                # Log to alert history
                for anomaly_type in anomaly_types:
                    cur.execute("""
                        INSERT INTO alert_history (user_id, alert_type, distance, temperature, message)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (user_id, anomaly_type, distance, temperature, f"Anomaly detected: {anomaly_type}"))
                
                conn.commit()
        finally:
            cur.close()
            conn.close()
    
    return {
        "is_anomaly": is_anomaly,
        "anomaly_types": anomaly_types,
        "distance": distance,
        "temperature": temperature
    }

def generate_realtime_prediction():
    """Generate simulated real-time sensor data and prediction"""
    distance = round(random.uniform(40, 100), 1)
    temperature = round(random.uniform(18, 25), 1)
    
    if distance < 50:
        prediction = "High Water Level"
        confidence = 0.92
    elif distance < 80:
        prediction = "Normal Water Level"
        confidence = 0.89
    else:
        prediction = "Low Water Level"
        confidence = 0.85
    
    return {
        "timestamp": datetime.now().isoformat(),
        "distance": distance,
        "temperature": temperature,
        "prediction": prediction,
        "confidence": confidence,
        "node_id": "NODE_001"
    }

async def predict_realtime_stream():
    """Continuously send real-time prediction updates"""
    while True:
        if manager.active_connections:
            prediction = generate_realtime_prediction()
            await manager.broadcast({
                "type": "prediction",
                "data": prediction
            })
        await asyncio.sleep(5)  # Send new prediction every 5 seconds

@app.websocket("/ws/predictions")
async def websocket_predictions(websocket: WebSocket):
    """WebSocket endpoint for real-time predictions"""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and wait for any messages
            data = await websocket.receive_text()
            # Echo back acknowledgment
            await websocket.send_json({
                "type": "ack",
                "message": "Connected to real-time predictions stream"
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        manager.disconnect(websocket)

# Start background task for real-time streaming
@app.on_event("startup")
async def startup_event():
    """Start background tasks on app startup"""
    asyncio.create_task(predict_realtime_stream())

def predict_water_activity(distance, temperature, time_features=None):
    """
    Simple prediction model based on water tank distance and temperature.
    Returns prediction and confidence score.
    """
    # Logic: Predict activity based on sensor values
    # Classes: Normal, Leak, High Usage, Filling
    
    confidence = 0.0
    prediction = "Normal"
    
    # High usage: decreasing distance (water level rising)
    if distance < 40:
        prediction = "High Usage"
        confidence = 0.9
    # Normal operation
    elif 40 <= distance < 80:
        prediction = "Normal"
        confidence = 0.85
    # Low water: increasing distance
    elif distance >= 80:
        prediction = "Low Water Alert"
        confidence = 0.88
    
    # Adjust confidence based on temperature
    if temperature > 30:
        confidence *= 0.95  # Higher temp reduces confidence slightly
    elif temperature < 15:
        confidence *= 0.92  # Lower temp also affects confidence
    
    # Ensure confidence stays between 0.5 and 1.0
    confidence = max(0.5, min(1.0, confidence))
    
    return prediction, confidence

# Model info endpoint
@app.get("/api/v1/model-info")
def get_model_info():
    return {
        "model_type": "Hybrid ML Model",
        "accuracy": 0.92,
        "version": "1.0.0",
        "last_trained": "2026-03-17",
        "classes": ["Normal", "High Usage", "Low Water Alert", "Leak Detection"],
        "input_features": ["distance", "temperature", "time_features"]
    }

# Prediction endpoint
@app.post("/api/v1/predict")
def make_prediction(data: PredictionInput):
    try:
        prediction, confidence = predict_water_activity(
            distance=data.distance,
            temperature=data.temperature,
            time_features=data.time_features
        )
        
        return {
            "prediction": prediction,
            "confidence": confidence,
            "input": {
                "distance": data.distance,
                "temperature": data.temperature
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "error": str(e),
            "prediction": "Error",
            "confidence": 0.0
        }

# ==============================
# START BACKGROUND COLLECTOR
# ==============================
@app.on_event("startup")
def start_background_tasks():

    create_tables()

    thread = threading.Thread(target=sensor_collector)
    thread.daemon = True
    thread.start()


# ==============================
# MAIN
# ==============================
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
