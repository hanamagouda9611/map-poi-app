const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

//----------- Update DB config as per your setup ---------------------
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 7051,
});

//----------- Get all POIs ---------------------
app.get('/api/pois', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, description,
             ST_Y(location) AS lat,
             ST_X(location) AS lng
      FROM pois
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching all POIs:", err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// ----------- Create POI (Corrected!) -----------------
app.post('/api/pois', async (req, res) => {
  const { name, description, lat, lng } = req.body;

  if (!name || !description || lat == null || lng == null) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    await pool.query(
      `INSERT INTO pois (name, description, location)
       VALUES ($1, $2, ST_SetSRID(ST_MakePoint($4, $3), 4326))`,
      [name, description, lat, lng]  // $3 = lat, $4 = lng
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("❌ Insert error:", err);
    res.status(500).json({ success: false, message: 'Database insert error' });
  }
});

// ----------------- Get POI by ID ---------------------
app.get('/api/pois/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(`
      SELECT id, name, description,
             ST_Y(location) AS lat,
             ST_X(location) AS lng
      FROM pois
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'POI not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ DB error:", err);
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

// --------------- Update POI -------------------
app.put('/api/pois/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, lat, lng } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE pois
      SET name = $1,
          description = $2,
          location = ST_SetSRID(ST_MakePoint($4, $3), 4326)
      WHERE id = $5
      RETURNING id
      `,
      [name, description, lat, lng, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'POI not found' });
    }

    res.json({ success: true, message: 'POI updated successfully' });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// --------------- Delete POI ------------------
app.delete('/api/pois/:id', async (req, res) => {
  try {
    await pool.query(`DELETE FROM pois WHERE id = $1`, [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------- Start server -------------------
app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000');
});
