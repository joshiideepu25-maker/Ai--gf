// src/components/ChatMessage.jsx
// Or /src/ChatMessage.jsx as you noted
import React from 'react';
import { User, UserSquare } from 'lucide-react';

export default function ChatMessage({ msg }) {
  const isUser = msg.role === 'user';

  if (isUser) {
    return (
      <div className="chat-message user">
        <div className="chat-bubble">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="chat-message bot">
      <div className="chat-avatar-placeholder">
        {/* Placeholder for Ready Player Me Avatar */}
        <UserSquare size={24} />
      </div>
      <div className="chat-bubble">{msg.text}</div>
    </div>
  );
}