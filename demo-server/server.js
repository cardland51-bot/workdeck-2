const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 10000;

// CORS for Vite preview/dev
const ORIGINS = ['http://localhost:5173','http://127.0.0.1:5173','http://localhost:4173','http://127.0.0.1:4173'];
app.use(cors({
  origin: function(origin, cb){
    if (!origin) return cb(null, true);
    if (ORIGINS.indexOf(origin) !== -1) return cb(null, true);
    return cb(null, true); // be permissive for local demo
  },
  credentials: true
}));

app.use(express.json());
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(UPLOAD_DIR));

// In-memory jobs store (resets on restart) + lightweight persistence
const DATA_FILE = path.join(__dirname, 'data.json');
let JOBS = [];
if (fs.existsSync(DATA_FILE)) {
  try { JOBS = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); } catch {}
}
function saveData(){ try{ fs.writeFileSync(DATA_FILE, JSON.stringify(JOBS, null, 2)); } catch(e){} }

// Multer storage
try { fs.mkdirSync(UPLOAD_DIR, { recursive: true }); } catch {}

  const storage = multer.diskStorage({
  destination: function(req, file, cb){ cb(null, UPLOAD_DIR); },
  filename: function(req, file, cb){
    const ext = path.extname(file.originalname) || '';
    cb(null, uuidv4() + ext);
  }
});
const upload = multer({ storage });

// ROUTES
app.get('/api/jobs/list', (req, res) => {
  const items = [...JOBS].sort((a,b)=> (b.createdAt||'').localeCompare(a.createdAt||''));
  res.json({ items });
});

app.post('/api/jobs/upload', upload.single('media'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no_file' });
  const id = uuidv4();
  const now = new Date().toISOString();
  const card = {
    id,
    label: req.body.label || 'General',
    notes: '',
    aiLow: Math.floor(100 + Math.random()*400),
    aiHigh: Math.floor(600 + Math.random()*1400),
    createdAt: now,
    media: {
      url: '/uploads/' + req.file.filename,
      type: req.file.mimetype
    }
  };
  JOBS.push(card);
  saveData();
  res.json(card);
});

// simple export stub
app.get('/api/export/:format/:cardId', (req, res) => {
  const c = JOBS.find(x=>x.id === req.params.cardId);
  if (!c) return res.status(404).send('Not found');
  const md = [
    `# WorkDeck Estimate (${c.id})`,
    `Created: ${c.createdAt}`,
    `Category: ${c.label}`,
    `Price Band: $${c.aiLow} - $${c.aiHigh}`,
    ``,
    `Notes:`,
    c.notes || '(none)',
    ``,
    `Media: ${req.protocol}://${req.get('host')}${c.media.url}`
  ].join('\n');
  const fmt = req.params.format;
  if (fmt === 'md') {
    res.setHeader('Content-Disposition', `attachment; filename="estimate-${c.id}.md"`);
    res.type('text/markdown').send(md);
  } else {
    // return markdown as a generic file for demo
    res.setHeader('Content-Disposition', `attachment; filename="estimate-${c.id}.${fmt}"`);
    res.type('text/plain').send(md);
  }
});


// Serve frontend build if available
const DIST_DIR = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  // SPA fallback for non-API routes (anything not /api or /uploads)
  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
  console.log(`[workdeck demo server] serving frontend from ${DIST_DIR}`);
} else {
  console.log(`[workdeck demo server] dist/ not found; start Vite dev server or run "npm run build" in root.`);
}

app.listen(PORT, () => {
  console.log(`[workdeck demo server] listening on http://localhost:${PORT}`);
});
