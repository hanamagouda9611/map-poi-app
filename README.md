# 🗺️ Map POI CRUD Web App

This project is a full-stack web application that allows users to create, view, and delete Points of Interest (POIs) on an interactive map using Leaflet and OpenStreetMap. Data is stored in a PostgreSQL database using PostGIS for geospatial support.

---

## 🔧 Tech Stack

*Frontend*:
1.React.js (for dynamic UI)
Leaflet.js or Mapbox GL JS (for interactive maps)

*Backend*:
Node.js with Express.js (API server)

*Database*:
PostgreSQL with PostGIS (for geographic data support)

---

### 📦 Project Structure
```
map-poi-app/
│
├── backend/ # Node.js Express API
│ └── server.js # Server logic
│
├── frontend/ # React app
│ ├── public/
│ └── src/
│ └── App.js # Map & POI logic
│ |__ README.md
|
```
---

## ⚙️ Prerequisites

- Node.js & npm
- PostgreSQL (with PostGIS enabled)
- Internet access (for map tiles from OpenStreetMap)

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
```
mkdir map-poi-backend && cd map-poi-backend
npm init -y
npm install express cors pg   # Create server.js and paste backend code

node server.js
```

### 3️⃣ Frontend Setupt
```
npx create-react-app map-poi-frontend
cd map-poi-frontend
npm install leaflet react-leaflet  # Replace src/App.js with the frontend code

npm start
```

🖱️ Features
🗺️ Click on map to select coordinates

➕ Add POIs with name and description

🗑️ Delete POIs directly from map popups

📍 Coordinates are stored using real spatial types (geometry in PostGIS)
