import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Setup default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const API_URL = 'http://localhost:5000/api/pois';

function LocationMarker({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
}

function App() {
  const [pois, setPois] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', lat: '', lng: '' });
  const [message, setMessage] = useState([]);

  // Load POIs from server
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setPois)
      .catch(err => {
        console.error("Failed to load POIs:", err);
        setMessage('❌ Failed to load POIs from server');
      });
  }, []);

  // Auto-clear messages after 4 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle map click to set lat/lng
  const handleMapClick = (latlng) => {
    setForm({ ...form, lat: latlng.lat, lng: latlng.lng });
  };

  // Submit POI
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save POI');
        return res.json();
      })
      .then(() => {
        setForm({ name: '', description: '', lat: '', lng: '' });
        setMessage('✅ POI saved successfully!');
        return fetch(API_URL).then(res => res.json()).then(setPois);
      })
      .catch(err => {
        console.error(err);
        setMessage('❌ Failed to save POI');
      });
  };

  // Delete POI
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete POI');
        return fetch(API_URL).then(res => res.json()).then(setPois);
      })
      .catch(err => {
        console.error(err);
        setMessage('❌ Failed to delete POI');
      });
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ position: 'relative', width: '70%' }}>
        {message && (
          <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '15px',
            boxShadow: '0px 2px 10px rgba(0,0,0,0.3)'
          }}>
            {message}
          </div>
        )}
        <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: '100vh' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker onMapClick={handleMapClick} />
          {pois.map(poi => (
            <Marker key={poi.id} position={[poi.lat, poi.lng]} />
          ))}
        </MapContainer>
      </div>

      <div style={{ width: '30%', padding: '20px' }}>
        <h3>Add POI</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          /><br /><br />
          <input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          /><br /><br />
          <input placeholder="Latitude" value={form.lat} readOnly /><br /><br />
          <input placeholder="Longitude" value={form.lng} readOnly /><br /><br />
          <button type="submit">Save</button>
        </form>

        <hr />
        <h3>Saved POIs</h3>
        <table border="1" cellPadding="5" width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Desc</th>
              <th>Lat</th>
              <th>Lng</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pois.map(poi => (
              <tr key={poi.id}>
                <td>{poi.name}</td>
                <td>{poi.description}</td>
                <td>{poi.lat}</td>
                <td>{poi.lng}</td>
                <td>
                  <button onClick={() => handleDelete(poi.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
