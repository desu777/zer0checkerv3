import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { getStyles } from '../styles/leaderboardStyles';

const Header = () => {
  const { darkMode, toggleTheme } = useTheme();
  const styles = getStyles(darkMode);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
  
  // Add effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Get theme-appropriate colors for the badge
  const badgeColor = darkMode ? '#00e6e6' : '#E074DD';
  const badgeBgColor = darkMode ? 'rgba(0, 230, 230, 0.15)' : 'rgba(224, 116, 221, 0.15)';

  return (
    <header style={{
      ...styles.header,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative'
    }}>
      {/* Left section - empty to help centering */}
      <div style={{width: '40px'}}></div>
      
      {/* Center section - logo and title */}
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <img 
            src={darkMode ? '/logo-dark.svg' : '/logo-light.svg'} 
            alt="Zer0" 
            style={{ height: '32px' }}
          />
          <span style={styles.logo}>Checker</span>
          {/* Only show Testnet V3 badge on non-mobile devices */}
          {!isMobile && (
            <span style={{
              ...styles.badge,
              fontSize: '14px',
              backgroundColor: badgeBgColor,
              color: badgeColor,
              padding: '2px 8px',
              borderRadius: '4px',
              marginLeft: '4px'
            }}>
              Testnet V3
            </span>
          )}
        </div>
      </div>
      
      {/* Right section - theme toggle */}
      <div>
        <button 
          onClick={toggleTheme} 
          style={styles.themeToggle}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header; 