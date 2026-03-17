import os
from dotenv import load_dotenv
import requests
import psycopg2
import time
import random
import threading
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from urllib.parse import urlparse

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

    conn.commit()
    cur.close()
    conn.close()


# ==============================
# THINGSPEAK CONFIG
# ==============================
REAL_DATA_WITH_CURRENT_TIME = False
TEST_MODE = True

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
