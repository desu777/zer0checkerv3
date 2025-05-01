import React from 'react';
import { useTheme } from '../ThemeContext';
import { getStyles } from '../styles/leaderboardStyles';

const MainMenu = () => {
  const { darkMode } = useTheme();
  const styles = getStyles(darkMode);
  
  // Theme-appropriate accent color
  const accentColor = darkMode ? '#00e6e6' : '#E074DD';

  return (
    <div style={styles.mainMenu}>
      <a 
        href="https://faucet.0g.ai/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...styles.menuItem(false),
          // Remove background, just use the theme color
          background: 'transparent',
          color: accentColor,
          padding: '8px 16px',
          borderRadius: '20px',
          textDecoration: 'none',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        Faucet
        <img 
          src={darkMode ? "/kropla.png" : "/kroplalight.png"}
          alt="Kropla" 
          style={{
            width: '24px',
            height: '24px',
            marginLeft: '4px',
            objectFit: 'contain'
          }}
        />
      </a>
      <a 
        href="https://test.zer0.exchange/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...styles.menuItem(false),
          // Apply the same styling as Faucet link
          background: 'transparent',
          color: accentColor,
          padding: '8px 16px',
          borderRadius: '20px',
          textDecoration: 'none',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        Back to zer0
        <img 
          src="/bubb.png" 
          alt="Bubble" 
          style={{
            width: '24px',
            height: '24px',
            marginLeft: '4px',
            objectFit: 'contain'
          }}
        />
      </a>
    </div>
  );
};

export default MainMenu; 