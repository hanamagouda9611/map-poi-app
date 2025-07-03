# 🗺️ Map POI CRUD Web App

This project is a full-stack web application that allows users to create, view, and delete Points of Interest (POIs) on an interactive map using Leaflet and OpenStreetMap. Data is stored in a PostgreSQL database using PostGIS for geospatial support.

---

## 🔧 Tech Stack

*Frontend*:
React.js (for dynamic UI),Leaflet.js or Mapbox GL JS (for interactive maps)

*Backend*:
Node.js with Express.js
OR Python FastAPI

*Database*:
PostgreSQL with PostGIS (for geographic data support)

---

### 📦 Project Structure
```
map-poi-app/
│
├── map-poin-backend/   # Node.js Express API
│ └── server.js   # Server logic
|
│├── map-poi-backend-py/    # Python FastAPI API
│   └── main.py  
|   └── requirements.txt   # Install dependencies:
|
├── map-poi-frontend/ # React app
│ ├── public/ 
│ └── src/
│ └── App.js # Map & POI logic
│ |__ README.md
|
```
---

## ⚙️ Prerequisites

Node.js & npm

Python 3.8+ (for FastAPI backend)

PostgreSQL with PostGIS enabled

Internet access (for map tiles)

---

## 🚀 Getting Started

### 1️⃣ Set up PostgreSQL & PostGIS

```sql
-- Connect to your database (e.g. `postgres`)
CREATE EXTENSION postgis;

-- Create POIs table
CREATE TABLE pois (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  location GEOMETRY(POINT, 4326)
);
```

### 2️⃣ Backend Setup
Option A: Node.js Backend
```
mkdir map-poi-backend && cd map-poi-backend
npm init -y
npm install express cors pg   # Create server.js and paste backend code
```

Start the server:
```
node server.js
```

Option B: Python FastAPI Backend

Create folder & Install dependencies:
```
mkdir map-poi-backend-py && cd map-poi-backend-py
pip install -r requirements.txt
```

Start the server:
```
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

### 3️⃣ Frontend Setupt
```
npx create-react-app map-poi-frontend
cd map-poi-frontend
npm install leaflet react-leaflet  # Replace src/App.js with the frontend code

npm start
```

🖱️ Features
🗺️ Interactive map (Leaflet + OpenStreetMap)

➕ Add POIs with name and description

📍 Coordinates stored as PostGIS geometry types

✏️ Edit POIs (if implemented)

🗑️ Delete POIs via map popups

