const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',       // Change if needed
  host: 'localhost',
  database: 'postgres',
  password: 'postgres', // <-- replace with your actual password
  port: 7051,
});


// Get all POIs
app.get('/api/pois', async (req, res) => {
  const result = await pool.query(
    'SELECT id, name, description, ST_Y(location::geometry) AS lat, ST_X(location::geometry) AS lng FROM pois'
  );
  res.json(result.rows);
});

// Add POI
app.post('/api/pois', async (req, res) => {
  const { name, description, lat, lng } = req.body;
  await pool.query(
    'INSERT INTO pois (name, description, location) VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326))',
    [name, description, lng, lat]
  );
  res.status(201).json({ success: true });  // ✅ Proper JSON response
});


// Delete POI
app.delete('/api/pois/:id', async (req, res) => {
  await pool.query('DELETE FROM pois WHERE id = $1', [req.params.id]);
  res.sendStatus(204);
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
