// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatPage from './ChatPage'; // Assuming ChatPage is in pages/
import { ThemeProvider } from './useTheme'; // Adjust path if needed
import './styles.css';

// Assuming your files are flat in src/ as you said
// import ChatPage from './ChatPage';
// import { ThemeProvider } from './useTheme';


const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ChatPage />
    </ThemeProvider>
  </React.StrictMode>
);