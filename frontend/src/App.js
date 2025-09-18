import React, { useState, useRef, useEffect } from "react";
import "./App.css";

// ✅ Import Markdown + Math plugins
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 bg-gray-800 text-center text-lg font-semibold border-gray-700">
        🤖 Chat Agent
      </div>

      {/* Chat Messages */}
      {/* Chat Messages */}
    <div className="chat-container">
      <div className="message-list">
        {messages.length === 0 && (
          <div className="empty-screen">
            What can I help for you today?
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.sender}`}>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {m.text}
            </ReactMarkdown>
          </div>
        ))}
        {loading && <div className="italic text-gray-500">Bot is typing...</div>}
        <div ref={chatEndRef} />
      </div>
    </div>


      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          setMessages([...messages, { sender: "user", text: input }]);
          setLoading(true);

          fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input, user_id: "student_987" }),
          })
            .then((res) => res.json())
            .then((data) => {
              setMessages((msgs) => [
                ...msgs,
                { sender: "bot", text: data.reply },
              ]);
            })
            .catch(() =>
              setMessages((msgs) => [
                ...msgs,
                { sender: "bot", text: "⚠️ Error: Backend not responding." },
              ])
            )
            .finally(() => setLoading(false));

          setInput("");
        }}
        className="chat-input"
      >
        <input
        type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="chat-textbox"
        />
        <button
          type="submit"
          className="send-btn"
        >
        {"\u27A4"}  
        </button>
      </form>
    </div>
  );
}

export default App;
