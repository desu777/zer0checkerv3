import React from 'react';
import { createRoot } from 'react-dom/client';
import LeaderboardComponent from './LeaderboardComponent';
import { ThemeProvider } from './ThemeContext';
import './LeaderboardStyles.css';

// Montowanie aplikacji
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <LeaderboardComponent />
    </ThemeProvider>
  </React.StrictMode>
); 