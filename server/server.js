const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const fs = require('fs');
// Serve client static files (prefer built `dist` when available, otherwise serve `client` for quick demos)
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
} else {
  app.use(express.static(path.join(__dirname, '..', 'client')));
}

// Simple quote array for /api/quote
const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
];

// Utility: map some city names to lat/lon
const cityCoords = {
  london: { lat: 51.5072, lon: -0.1276 },
  "new york": { lat: 40.7128, lon: -74.0060 },
  delhi: { lat: 28.6139, lon: 77.2090 },
  mumbai: { lat: 19.0760, lon: 72.8777 },
  tokyo: { lat: 35.6762, lon: 139.6503 }
};

// Minimal mapping of Open-Meteo weathercodes to text (partial)
const weatherCodeMap = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  80: 'Rain showers',
  95: 'Thunderstorm'
};

// GET /api/quote
app.get('/api/quote', (req, res) => {
  try {
    const idx = Math.floor(Math.random() * quotes.length);
    res.json({ quote: quotes[idx] });
  } catch (err) {
    console.error('Quote error', err);
    res.status(500).json({ error: 'Could not fetch quote.' });
  }
});

// GET /api/weather?city=London
app.get('/api/weather', async (req, res) => {
  try {
    const city = (req.query.city || 'london').toLowerCase();
    const coords = cityCoords[city] || cityCoords['london'];

    // Use Open-Meteo (no API key required)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&temperature_unit=celsius`;

    const resp = await axios.get(url);
    const cw = resp.data && resp.data.current_weather;
    if (!cw) {
      return res.status(500).json({ error: 'Could not fetch weather data.' });
    }

    const condition = weatherCodeMap[cw.weathercode] || `Code ${cw.weathercode}`;

    res.json({
      city: city,
      temperature: cw.temperature,
      windspeed: cw.windspeed,
      weathercode: cw.weathercode,
      condition
    });
  } catch (err) {
    console.error('Weather error', err.message || err);
    res.status(500).json({ error: 'Could not fetch weather data.' });
  }
});

// GET /api/currency?amount=100
app.get('/api/currency', async (req, res) => {
  try {
    const amount = parseFloat(req.query.amount || '1');
    if (isNaN(amount) || amount < 0) {
      return res.status(400).json({ error: 'Invalid amount parameter.' });
    }

    // Use exchangerate.host (free, no key) to get INR -> USD,EUR rates
    // latest?base=INR&symbols=USD,EUR
    const url = `https://api.exchangerate.host/latest?base=INR&symbols=USD,EUR`;
    const resp = await axios.get(url);
    const rates = resp.data && resp.data.rates;
    if (!rates) {
      return res.status(500).json({ error: 'Could not fetch currency rates.' });
    }

    const usd = +(amount * rates.USD).toFixed(4);
    const eur = +(amount * rates.EUR).toFixed(4);

    res.json({ base: 'INR', amount, usd, eur, rates });
  } catch (err) {
    console.error('Currency error', err.message || err);
    res.status(500).json({ error: 'Could not fetch currency data.' });
  }
});

// Fallback: serve index.html for client-side routing (from dist if built)
app.get('*', (req, res) => {
  const indexFrom = fs.existsSync(clientDist)
    ? path.join(clientDist, 'index.html')
    : path.join(__dirname, '..', 'client', 'index.html');
  res.sendFile(indexFrom);
});

app.listen(PORT, () => {
  console.log(`InfoHub server listening on port ${PORT}`);
});
