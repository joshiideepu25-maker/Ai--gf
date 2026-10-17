// src/components/Header.jsx
// Or /src/Header.jsx as you noted
import React from 'react';
import { useTheme } from './useTheme'; // Adjust path if needed
import {
  Moon, Sun, User, UserSquare, Mic, BookOpen, Smile, Settings, Trash2
} from 'lucide-react';

export default function Header({ onClearChat }) {
  const { theme, toggleTheme, persona, togglePersona } = useTheme();

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="avatar-placeholder">
          {/* This is where the Ready Player Me avatar would go */}
          <UserSquare size={32} />
        </div>
        <div className="persona-details">
          <h1 className="persona-name">
            {persona === 'female' ? 'AI Companion (GF)' : 'AI Companion (BF)'}
          </h1>
          <div className="persona-status">
            <span className="status-indicator"></span>
            Online
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Placeholders for new features */}
        <button className="icon-btn" aria-label="Voice settings (ElevenLabs)">
          <Mic size={18} />
        </button>
        <button className="icon-btn" aria-label="View journal (Firestore)">
          <BookOpen size={18} />
        </button>
        <button className="icon-btn" aria-label="Current mood (Sentiment)">
          <Smile size={18} />
        </button>
        <button className="icon-btn" aria-label="Settings (AR/VR/Offline)">
          <Settings size={18} />
        </button>

        <span className="divider" />

        {/* Theme and Persona Toggles */}
        <button
          className="icon-btn"
          onClick={togglePersona}
          aria-label={`Switch to ${persona === 'female' ? 'male' : 'female'} persona`}
        >
          <User size={18} />
          <span style={{ marginLeft: '4px', fontSize: '12px', fontWeight: '600' }}>
             {persona === 'female' ? 'F' : 'M'}
          </span>
        </button>
        
        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        
        <button
          className="icon-btn clear-btn"
          onClick={onClearChat}
          aria-label="Clear chat"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </header>
  );
}