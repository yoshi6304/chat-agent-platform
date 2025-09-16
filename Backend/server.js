// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ChatAgent = require('./chatAgent'); // adjust path if chatAgent.js is in sdk/

console.log('ENV CHECK:', {
  OPENAI: !!process.env.OPENAI_API_KEY,
  CONTENTSTACK_API_KEY: !!process.env.CONTENTSTACK_API_KEY,
});

const agent = new ChatAgent({
  region: process.env.CONTENTSTACK_REGION,
  environment: process.env.CONTENTSTACK_ENV,
  apiKey: process.env.CONTENTSTACK_API_KEY,
  deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN,
  managementToken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
  openaiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL,
});

const app = express();
app.use(express.json());
app.use(cors());

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message || '';
    const userId = req.body.user_id || 'guest';
    console.log('[server] /chat from', userId, 'message:', userMessage);

    const reply = await agent.getBotReply(userMessage);
    await agent.saveChatHistory(userId, userMessage, reply);

    res.json({ reply });
  } catch (err) {
    console.error('[server] /chat error:', err.response?.data || err.message || err);
    res.status(500).json({ reply: '⚠️ Error: Could not process request.' });
  }
});

app.get('/', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));
