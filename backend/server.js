const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database setup
const dbPath = path.join(__dirname, 'recipes.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database:', dbPath);
    // Check if recipes table exists and has data
    db.get('SELECT COUNT(*) as count FROM recipes', (err, row) => {
      if (err) {
        console.error('Error checking database:', err.message);
        console.log('⚠️  Database may not be initialized. Run: npm run init-db');
      } else {
        console.log(`✅ Database has ${row.count} recipes`);
        if (row.count === 0) {
          console.log('⚠️  No recipes found. Run: npm run init-db');
        }
      }
    });
  }
});

// Get recipe by mood
app.get('/api/recipes/:mood', (req, res) => {
  const { mood } = req.params;
  console.log(`Fetching recipe for mood: ${mood}`);
  
  db.all(
    'SELECT * FROM recipes WHERE mood = ? ORDER BY RANDOM() LIMIT 1',
    [mood],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch recipe', details: err.message });
      }
      
      if (rows.length === 0) {
        console.log(`No recipes found for mood: ${mood}`);
        return res.status(404).json({ error: 'No recipes found for this mood' });
      }
      
      console.log(`✅ Returning recipe: ${rows[0].name}`);
      res.json(rows[0]);
    }
  );
});

// Get all recipes for a mood (for getting a new one)
app.get('/api/recipes/:mood/all', (req, res) => {
  const { mood } = req.params;
  console.log(`Fetching all recipes for mood: ${mood}`);
  
  db.all(
    'SELECT * FROM recipes WHERE mood = ? ORDER BY RANDOM()',
    [mood],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch recipes', details: err.message });
      }
      
      console.log(`✅ Returning ${rows.length} recipes for mood: ${mood}`);
      res.json(rows);
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
