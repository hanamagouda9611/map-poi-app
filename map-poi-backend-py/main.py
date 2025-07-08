from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

app = FastAPI()

# ---------------- CORS --------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- PostgreSQL connection ------------------
conn = psycopg2.connect(
    host="localhost",
    port=7051,
    database="postgres",
    user="postgres",
    password="postgres"
)
conn.autocommit = True

# ------------ Schema --------------
class POI(BaseModel):
    name: str
    description: str
    lat: float
    lng: float

# ---------------- Get all POIs ----------------
@app.get("/api/pois")
def get_pois():
    with conn.cursor() as cur:
        cur.execute("""
            SELECT id, name, description,
                   ST_Y(location), ST_X(location)
            FROM pois
        """)
        return [
            {
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "lat": row[3],
                "lng": row[4]
            } for row in cur.fetchall()
        ]

# ------------------ Create a POI ----------------------
@app.post("/api/pois", status_code=201)
def create_poi(poi: POI):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO pois (name, description, location)
            VALUES (%s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326))
        """, (poi.name, poi.description, poi.lng, poi.lat))
    return {"success": True}

# -------------------- Delete POI by ID -------------------------
@app.delete("/api/pois/{id}", status_code=204)
def delete_poi(id: int):
    with conn.cursor() as cur:
        cur.execute("DELETE FROM pois WHERE id = %s", (id,))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="POI not found")
