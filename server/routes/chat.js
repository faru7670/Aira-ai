const express = require('express');

const router = express.Router();

const userHistory = new Map();

router.get('/history/:uid', (req, res) => {
  const { uid } = req.params;
  res.json({ messages: userHistory.get(uid) || [] });
});

router.delete('/history/:uid', (req, res) => {
  const { uid } = req.params;
  userHistory.delete(uid);
  res.json({ ok: true });
});

router.post('/chat', async (req, res) => {
  const { uid, messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:5173',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'AIRA-AI',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct',
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'OpenRouter request failed',
      });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(500).json({ error: 'No reply from model' });
    }

    if (uid) {
      userHistory.set(uid, [...messages, { role: 'assistant', content: reply }]);
    }

    return res.json({ reply });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

module.exports = router;
