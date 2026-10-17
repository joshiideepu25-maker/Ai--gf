// src/pages/ChatPage.jsx
// Or /src/ChatPage.jsx as you noted
import React, { useState, useRef, useEffect } from 'react';
import useChat from './useChat'; // Adjust path if needed
import ChatMessage from './ChatMessage'; // Adjust path if needed
import Header from './Header'; // Adjust path if needed
import { Send, Loader2 } from 'lucide-react';

export default function ChatPage() {
  // Note: I removed the 'mode' state, as the persona is now global
  const { messages, send, clear, loading } = useChat([]);
  const [text, setText] = useState('');
  const scrollerRef = useRef();

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const t = text.trim();
    if (!t || loading) return;
    setText('');
    await send(t); // The persona can be grabbed from useTheme in useChat if needed
  };

  return (
    <div className="chat-page">
      <Header onClearChat={clear} />
      
      <main className="chat-main" ref={scrollerRef}>
        <div className="chat-message-list">
          {messages.length === 0 ? (
            <div className="chat-empty-state">
              <span className="wave-emoji">👋</span>
              <p>Start a conversation.
                <br />
                Your AI companion is ready to chat.
              </p>
            </div>
          ) : (
            messages.map((m) => <ChatMessage key={m.id} msg={m} />)
          )}
          {loading && (
             <div className="chat-message bot">
               <div className="chat-avatar-placeholder">
                 <Loader2 className="spinner" size={20} />
               </div>
               <div className="chat-bubble">
                 Typing...
               </div>
             </div>
          )}
        </div>
      </main>

      <form onSubmit={handleSubmit} className="chat-form">
        <div className="chat-input-wrapper">
          <label htmlFor="msg" className="sr-only">Message</label>
          <input
            id="msg"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={loading ? 'Waiting for reply…' : 'Type a message...'}
            className="chat-input"
            disabled={loading}
          />
          <button
            type="submit"
            className="chat-send-btn"
            aria-label="Send message"
            disabled={loading || text.trim().length === 0}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}