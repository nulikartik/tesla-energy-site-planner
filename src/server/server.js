import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;

// Middleware configuration
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure our secure directory exists
const DATA_DIR = path.join(__dirname, 'saved_sessions');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
  console.log('📁 Created secure data directory: saved_sessions/');
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running smoothly', storagePath: DATA_DIR });
});

app.listen(PORT, () => {
  console.log(`🚀 Tesla Backend Infrastructure listening on http://localhost:${PORT}`);
});

// 🌐 POST: Save session configuration directly to a physical file on disk
app.post('/api/session/:id', (req, res) => {
  const { id } = req.params;
  const { quantities } = req.body;
  
  if (!quantities) {
    return res.status(400).json({ error: 'No configuration data provided' });
  }
  
  const filePath = path.join(DATA_DIR, `${id}.json`);
  const sessionData = { quantities, updatedAt: new Date() };

  // Write the layout state to disk asynchronously
  fs.writeFile(filePath, JSON.stringify(sessionData, null, 2), (err) => {
    if (err) {
      console.error('❌ File write error:', err);
      return res.status(500).json({ error: 'Failed to save blueprint data on disk' });
    }
    console.log(`💾 Successfully saved blueprint session: ${id}.json`);
    return res.sendStatus(200);
  });
});

// 🌐 GET: Retrieve a saved session file from the server disk
app.get('/api/session/:id', (req, res) => {
  const { id } = req.params;
  const filePath = path.join(DATA_DIR, `${id}.json`);

  // Check if the requested file exists on disk
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Session blueprint file not found' });
  }

  // Read the JSON file from disk and return it to the client
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ File read error:', err);
      return res.status(500).json({ error: 'Failed to read blueprint data' });
    }
    return res.json(JSON.parse(data));
  });
});