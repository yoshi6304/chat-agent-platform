# 🤖 Chat Agent Platform

An **AI-powered chatbot** built with React (frontend), Node.js (backend), OpenAI (for AI responses), and Contentstack CMS (for storing chat history).  
Includes **local JSON fallback** if Contentstack is unavailable.

---

## 🚀 Features
- Modern **chat UI** (React + TailwindCSS).
- AI replies from **OpenAI GPT models**.
- Saves chat history in **Contentstack**.
- Auto fallback to **chat_history.json** locally.
- Works with **frontend + backend** easily.

---

## 📂 Project Structure
```
chat-agent-platform/
├── backend/
│ ├── server.js # Express backend
│ ├── chatAgent.js # SDK (OpenAI + Contentstack + local fallback)
│ ├── package.json
│ ├── chat_history.json # Created automatically if Contentstack fails
│ └── .env # Environment variables (not committed)
│
├── frontend/
│ ├── src/
│ │ ├── App.js # Chat UI
│ │ ├── App.css # Styles
│ │ └── ...
│ ├── package.json
│ └── .env (optional for frontend configs)
│
└── README.md # This file
```



---

## ⚙️ Setup Instructions


### SET UP AND GUIDANCE 
### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/chat-agent-platform.git
cd chat-agent-platform
```
### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a .env file inside /backend with the following:

# Contentstack
```
CONTENTSTACK_API_KEY=your_api_key_here
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
CONTENTSTACK_MANAGEMENT_TOKEN=your_management_token_here
CONTENTSTACK_ENV=development
CONTENTSTACK_REGION=us

# OpenAI
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-4o-mini

# Server
PORT=5000
```
Run the backend:
node server.js

✅ Expected log:
✅ Backend running at http://localhost:5000

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm start


Runs at:
http://localhost:3000
```


🗂️ Chat History Storage
If Contentstack is available → history is saved there.

If not → saved locally in backend/chat_history.json.

###📜 .gitignore Example
```bash
node_modules/
.env
chat_history.json
```
✅ Usage
Open http://localhost:3000
Ask questions in chat
Bot replies with OpenAI
History is saved automatically

🛠️ Tech Stack
Frontend: React, TailwindCSS, React Markdown, KaTeX
Backend: Node.js, Express, Axios
AI: OpenAI GPT models
CMS: Contentstack
Storage: JSON fallback

👨‍💻 Author
Made with ❤️ for hackathons and learning.



