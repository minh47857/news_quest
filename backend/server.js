import express from 'express';
import cors from 'cors';
import { fetchNewsPolls } from './fetch_news.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/news-polls', async (req, res) => {
  try {
    const { pageSize = 5, sources = 'techcrunch,crypto-coins-news', language = 'en' } = req.query;
    const polls = await fetchNewsPolls(Number(pageSize), sources, language);
    res.json(polls);
  } catch (error) {
    console.error('Error fetching news polls:', error);
    res.status(500).json({ error: 'Failed to fetch news polls' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
