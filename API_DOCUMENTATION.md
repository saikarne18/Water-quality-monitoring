# Backend API Documentation - Task 2

Complete reference for all API endpoints: Authentication, Predictions, Alerts, CSV Upload, WebSocket, and Real-time Features.

---

## Base URL
- **Development**: `http://127.0.0.1:8000`
- **Production**: `https://your-backend-url.onrender.com`

---

## Table of Contents
1. [Health Check](#health-check)
2. [Authentication](#authentication)
3. [Predictions](#predictions)
4. [Model Info](#model-info)
5. [CSV Upload](#csv-upload)
6. [Alerts](#alerts)
7. [WebSocket Real-Time](#websocket-real-time)
8. [Sensor Data](#sensor-data)

---

## Health Check

### GET /api/v1/health
Check if API is running and database is connected.

**Request:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/health"
```

**Response (200 OK):**
```json
{
  "status": "alive",
  "message": "API is running",
  "database": "connected"
}
```

---

## Authentication

### POST /api/v1/signup
Register a new user account.

**Request:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/signup" \
  -H "Content-Type: application/json" \
  -d {
    "email": "user@example.com",
    "username": "john_doe",
    "password": "SecurePassword123!"
  }
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

**Error (400):**
```json
{
  "detail": "Email already registered"
}
```

---

### POST /api/v1/login
Login with email and password.

**Request:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/login" \
  -H "Content-Type: application/json" \
  -d {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

**Error (401):**
```json
{
  "detail": "Invalid credentials"
}
```

---

### GET /api/v1/verify-token
Verify if token is valid and get user info.

**Request:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/verify-token" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200 OK):**
```json
{
  "valid": true,
  "user_id": 1,
  "email": "user@example.com"
}
```

**Error (401):**
```json
{
  "detail": "Invalid token"
}
```

---

### GET /api/v1/user/profile
Get authenticated user's profile information.

**Request:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/user/profile" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "john_doe",
  "created_at": "2026-03-18T10:30:00Z"
}
```

---

## Predictions

### GET /api/v1/model-info
Get information about the deployed ML model.

**Request:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/model-info"
```

**Response (200 OK):**
```json
{
  "model_type": "Hybrid ML Model",
  "accuracy": 0.94,
  "f1_score": 0.92,
  "version": "1.0.0",
  "last_trained": "2026-03-18",
  "classes": ["Normal", "High Usage", "Low Water Alert", "Leak Detection"],
  "input_features": ["distance", "temperature", "time_features"],
  "parameters": 56000
}
```

---

### POST /api/v1/predict
Make a single prediction based on sensor input.

**Request:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/predict" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d {
    "distance": 65.5,
    "temperature": 22.3,
    "time_features": [1, 10, 30, 2026]
  }
```

**Request Body:**
```json
{
  "distance": 65.5,
  "temperature": 22.3,
  "time_features": [1, 10, 30, 2026]
}
```

**Response (200 OK):**
```json
{
  "prediction": "Normal",
  "confidence": 0.92,
  "input": {
    "distance": 65.5,
    "temperature": 22.3
  },
  "timestamp": "2026-03-18T14:35:22.123Z"
}
```

---

### GET /api/v1/predictions-history
Get historical predictions for the user.

**Request:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/predictions-history?limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 100, max: 1000)

**Response (200 OK):**
```json
{
  "predictions": [
    {
      "id": 123,
      "distance": 65.5,
      "temperature": 22.3,
      "prediction": "Normal",
      "confidence": 0.92,
      "created_at": "2026-03-18T14:35:22Z"
    },
    {
      "id": 122,
      "distance": 35.2,
      "temperature": 24.1,
      "prediction": "High Usage",
      "confidence": 0.89,
      "created_at": "2026-03-18T14:30:15Z"
    }
  ],
  "total": 150
}
```

---

## CSV Upload

### POST /api/v1/upload-csv
Upload CSV file for batch predictions.

**Request:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/upload-csv" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@predictions.csv"
```

**CSV Format:**
```csv
distance,temperature
65.5,22.3
35.2,24.1
85.0,20.5
45.3,25.0
```

**Response (200 OK):**
```json
{
  "message": "File processed successfully",
  "total_rows": 4,
  "successful": 4,
  "failed": 0,
  "predictions": [
    {
      "row": 1,
      "distance": 65.5,
      "temperature": 22.3,
      "prediction": "Normal",
      "confidence": 0.92,
      "status": "success"
    },
    {
      "row": 2,
      "distance": 35.2,
      "temperature": 24.1,
      "prediction": "High Usage",
      "confidence": 0.89,
      "status": "success"
    }
  ]
}
```

**Error (400):**
```json
{
  "message": "Invalid CSV format",
  "error": "Missing required columns: distance, temperature"
}
```

---

## Alerts

### GET /api/v1/alerts/preferences
Get user's alert preferences.

**Request:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/alerts/preferences" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200 OK):**
```json
{
  "email_alerts_enabled": true,
  "high_water_alert": true,
  "low_water_alert": true,
  "temperature_alert": true,
  "temperature_threshold": 30.0
}
```

---

### POST /api/v1/alerts/preferences
Update user's alert preferences.

**Request:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/alerts/preferences" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d {
    "email_alerts_enabled": true,
    "high_water_alert": true,
    "low_water_alert": true,
    "temperature_alert": true,
    "temperature_threshold": 32.0
  }
```

**Response (200 OK):**
```json
{
  "message": "Alert preferences updated",
  "status": "success"
}
```

---

### GET /api/v1/alerts/history
Get alert history for authenticated user.

**Request:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/alerts/history?limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Query Parameters:**
- `limit` (optional): Number of records (default: 50)

**Response (200 OK):**
```json
{
  "alerts": [
    {
      "id": 1,
      "alert_type": "High Water Level Alert",
      "distance": 28.5,
      "temperature": 22.3,
      "message": "Water level critically high",
      "sent_at": "2026-03-18T14:35:22Z"
    },
    {
      "id": 2,
      "alert_type": "Temperature Alert",
      "distance": 65.0,
      "temperature": 31.5,
      "message": "Temperature exceeds threshold",
      "sent_at": "2026-03-18T14:20:10Z"
    }
  ],
  "total": 5
}
```

---

### POST /api/v1/alerts/test
Send test alert to verify email configuration.

**Request:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/alerts/test" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200 OK):**
```json
{
  "message": "Test alert sent",
  "status": "success"
}
```

---

### GET /api/v1/anomaly-check
Check if given sensor readings contain anomalies.

**Request:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/anomaly-check?distance=25&temperature=35" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Query Parameters:**
- `distance` (float): Water distance in cm
- `temperature` (float): Temperature in °C

**Response (200 OK - Anomaly Detected):**
```json
{
  "is_anomaly": true,
  "anomaly_types": [
    "High Water Level Alert",
    "High Temperature Alert"
  ],
  "distance": 25.0,
  "temperature": 35.0
}
```

**Response (200 OK - No Anomaly):**
```json
{
  "is_anomaly": false,
  "anomaly_types": [],
  "distance": 65.0,
  "temperature": 22.0
}
```

---

## WebSocket Real-Time

### WS /ws/predictions
WebSocket endpoint for real-time prediction streaming.

**Connection (JavaScript):**
```javascript
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//${window.location.host}/ws/predictions`);

ws.onopen = () => {
  console.log('Connected to real-time predictions');
  ws.send(JSON.stringify({ type: 'connect' }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === 'prediction') {
    console.log('New prediction:', message.data);
    // {
    //   "timestamp": "2026-03-18T14:35:22Z",
    //   "distance": 65.5,
    //   "temperature": 22.3,
    //   "prediction": "Normal",
    //   "confidence": 0.92,
    //   "node_id": "NODE_001"
    // }
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected from real-time predictions');
};
```

**Message Format - Incoming:**
```json
{
  "type": "prediction",
  "data": {
    "timestamp": "2026-03-18T14:35:22Z",
    "distance": 65.5,
    "temperature": 22.3,
    "prediction": "Normal",
    "confidence": 0.92,
    "node_id": "NODE_001"
  }
}
```

---

## Sensor Data

### GET /sensor-data
Fetch latest sensor readings (legacy endpoint).

**Request:**
```bash
curl -X GET "http://127.0.0.1:8000/sensor-data"
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "node_id": "NODE_001",
    "distance": 65.5,
    "temperature": 22.3,
    "timestamp": "2026-03-18T14:35:22Z"
  }
]
```

---

## Error Handling

All errors follow this format:

**400 Bad Request:**
```json
{
  "detail": "Description of what went wrong"
}
```

**401 Unauthorized:**
```json
{
  "detail": "Missing or invalid authorization token"
}
```

**403 Forbidden:**
```json
{
  "detail": "You do not have permission to access this resource"
}
```

**404 Not Found:**
```json
{
  "detail": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "An error occurred while processing your request"
}
```

---

## Authentication Headers

Include JWT token in all protected endpoints:

```
Authorization: Bearer <access_token>
```

**Example:**
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/user/profile" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjI0NjMwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
```

---

## Rate Limiting

- **Predictions**: 100 requests per minute per user
- **CSV Upload**: 10 uploads per hour per user
- **WebSocket**: 1 connection per user (auto-disconnect if creating duplicate)

---

## CORS Configuration

The API allows requests from:
- `http://127.0.0.1:3000` (local development)
- `https://your-frontend-domain.com` (production)
- `https://*.vercel.app` (Vercel deployments)

---

## Testing the API

### Using Postman
1. Download [Postman](https://www.postman.com/downloads/)
2. Import the collection (API documentation)
3. Set `{{base_url}}` variable to your API URL
4. Set `{{token}}` variable after login
5. Test each endpoint

### Using cURL
See examples in each endpoint section above.

### Using Python
```python
import requests
import json

base_url = "http://127.0.0.1:8000"

# Sign up
response = requests.post(f"{base_url}/api/v1/signup", json={
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPassword123!"
})
token = response.json()["access_token"]

# Make prediction
response = requests.post(
    f"{base_url}/api/v1/predict",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "distance": 65.5,
        "temperature": 22.3,
        "time_features": [1, 10, 30, 2026]
    }
)
print(response.json())
```

---

## Deployment Checklist

- [ ] All endpoints tested locally
- [ ] Database connected and tables created
- [ ] JWT tokens working correctly
- [ ] CORS configured for frontend domain
- [ ] WebSocket connection stable
- [ ] Email alerts working
- [ ] CSV upload processing correctly
- [ ] Rate limiting implemented
- [ ] Error handling consistent
- [ ] API documentation updated
- [ ] Ready for production deployment

---

*Last Updated: March 18, 2026*

---
