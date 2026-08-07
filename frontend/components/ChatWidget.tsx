"use client";
// LEARNING NOTE: "use client" tells Next.js this component needs to run in the
// browser (not just the server), because it uses useState and event handlers.
// Server Components can't do that - this is one of the core React/Next.js concepts.

import { useState } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ChatWidget({ documentaryTitle }: { documentaryTitle?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: documentaryTitle
        ? `Ask me anything about "${documentaryTitle}"!`
        : "Ask me anything about the documentaries on this site!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I couldn't reach the server. Is the backend running?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-widget">
      <div className="chat-header">Ask the Documentary AI</div>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="chat-msg bot">Thinking...</div>}
      </div>
      <div className="chat-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="e.g. What honey collectors are shown in the Sundarbans episode?"
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
