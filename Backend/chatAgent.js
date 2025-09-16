// chatAgent.js
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

class ChatAgent {
  constructor(config = {}) {
    this.config = config;
    this.openaiKey = config.openaiKey || process.env.OPENAI_API_KEY || null;
    this.openaiModel = config.openaiModel || process.env.OPENAI_MODEL || 'gpt-4o-mini';
    this.apiKey = config.apiKey || process.env.CONTENTSTACK_API_KEY || null;
    this.managementToken = config.managementToken || process.env.CONTENTSTACK_MANAGEMENT_TOKEN || null;
    this.deliveryToken = config.deliveryToken || process.env.CONTENTSTACK_DELIVERY_TOKEN || null;
    this.regionSuffix = ((config.region || process.env.CONTENTSTACK_REGION || '').toLowerCase() === 'eu') ? '.eu' : '';
    this.CDN_BASE = `https://cdn${this.regionSuffix}.contentstack.io/v3`;
    this.API_BASE = `https://api${this.regionSuffix}.contentstack.io/v3`;
    this.logPath = path.join(process.cwd(), 'chat_history.json');
  }

  async getBotReply(userMessage) {
    if (!this.openaiKey) return `You said: ${userMessage}`;
    try {
      const resp = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.openaiModel,
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.2,
          max_tokens: 400,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return resp.data.choices?.[0]?.message?.content?.trim() || '⚠️ No reply from model';
    } catch (err) {
      console.error('[ChatAgent] OpenAI error:', err.response?.data || err.message);
      return '⚠️ Error: Could not get reply from OpenAI.';
    }
  }

  async saveChatHistory(userId, userMessage, botReply) {
    if (this.apiKey && this.managementToken) {
      try {
        const url = `${this.API_BASE}/content_types/chat_history/entries`;
        const body = {
          entry: {
            user_id: userId,
            user_message: userMessage,
            bot_reply: botReply,
            timestamp: new Date().toISOString(),
          },
        };
        const resp = await axios.post(url, body, {
          headers: {
            api_key: this.apiKey,
            authorization: this.managementToken,
            'Content-Type': 'application/json',
          },
        });
        console.log('[ChatAgent] Saved to Contentstack', resp.data.entry?.uid || '');
        return resp.data;
      } catch (err) {
        console.error('[ChatAgent] Contentstack save failed:', err.response?.data || err.message);
      }
    }
    // fallback local
    const newEntry = {
      user_id: userId,
      user_message: userMessage,
      bot_reply: botReply,
      timestamp: new Date().toISOString(),
    };
    let history = [];
    if (await fs.pathExists(this.logPath)) {
      history = await fs.readJSON(this.logPath);
      if (!Array.isArray(history)) history = [];
    }
    history.push(newEntry);
    await fs.writeJSON(this.logPath, history, { spaces: 2 });
    console.log('[ChatAgent] Saved locally to', this.logPath);
    return null;
  }
}

module.exports = ChatAgent;
