import { useState, useEffect } from 'react';
import { api } from './api'; // Ensure this points to axios instance

export default function useChat() {
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // 1. Load History on Startup
  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const history = await api.get('/history');
        const formattedHistory = history.map((msg, index) => ({
          ...msg,
          id: Date.now() + index, 
          createdAt: new Date().toISOString()
        }));
        setMessages(formattedHistory);
      } catch (err) {
        console.error("Failed to load history (Server might be offline):", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []); 

  // 2. Send Function
  const send = async (text) => {
    if (!text || !text.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text,
      createdAt: new Date().toISOString(),
    };
    
    // Optimistic UI Update
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    // Prepare history for backend
    const historyForBackend = [...messages, userMsg].map(msg => ({
      role: msg.role,
      text: msg.text
    }));

    try {
      const res = await api.post('/chat', { history: historyForBackend });
      const replyText = res?.reply ?? '...';
      
      const bot = {
        id: Date.now() + 1,
        role: 'assistant',
        text: replyText,
        createdAt: new Date().toISOString(),
      };
      
      setMessages((m) => [...m, bot]);
    } catch (err) {
      setMessages((m) => [...m, {
        id: Date.now(),
        role: 'assistant',
        text: 'Server Error: Make sure python main.py is running!',
      }]);
    } finally {
      setLoading(false);
    }
  };

  // 3. Clear Function (NOW WIPES DATABASE TOO)
  const clear = async () => {
    try {
        // Call the backend to wipe memory
        await api.post('/reset'); 
        // Clear the UI
        setMessages([]);
    } catch (err) {
        console.error("Could not wipe memory:", err);
        setMessages([]); // Clear UI anyway
    }
  };

  return { messages, send, clear, loading, setMessages };
}