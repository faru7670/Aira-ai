require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', chatRoutes);

app.listen(PORT, () => {
  console.log(`AIRA-AI server listening on http://localhost:${PORT}`);
});
