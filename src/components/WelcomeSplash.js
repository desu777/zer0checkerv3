import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { getStyles } from '../styles/leaderboardStyles';

const WelcomeSplash = () => {
  const { darkMode } = useTheme();
  const styles = getStyles(darkMode);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
  
  // Show the splash screen only if it's the first visit
  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('zer0_hasSeenSplash');
    
    // If the user hasn't seen the splash screen before, show it
    if (!hasSeenSplash) {
      setIsVisible(true);
    }
    
    // Add window resize listener to detect mobile screens
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleDismiss = () => {
    // Mark the splash as seen in localStorage
    localStorage.setItem('zer0_hasSeenSplash', 'true');
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  // Theme-appropriate colors for the splash
  const accentColor = darkMode ? '#00e6e6' : '#E074DD';
  const accentColorBg = darkMode ? 'rgba(0, 230, 230, 0.15)' : 'rgba(224, 116, 221, 0.15)';
  const bubbleBg = darkMode ? 'rgba(0, 230, 230, 0.05)' : 'rgba(224, 116, 221, 0.05)';
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        backgroundColor: darkMode ? 'rgba(0, 10, 20, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: isMobile ? '20px' : '40px',
        maxWidth: '600px',
        width: '90%',
        boxShadow: darkMode ? '0 8px 32px rgba(0, 230, 230, 0.2)' : '0 8px 32px rgba(224, 116, 221, 0.2)',
        position: 'relative',
        border: `1px solid ${darkMode ? 'rgba(0, 230, 230, 0.3)' : 'rgba(224, 116, 221, 0.3)'}`
      }}>
        {/* Close button */}
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
            cursor: 'pointer',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8px',
            zIndex: 10
          }}
        >
          <X size={24} />
        </button>
        
        {/* Header with images - Responsive layout */}
        {isMobile ? (
          // Mobile layout - stack vertically
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '15px'
            }}>
              <img 
                src="/bubb.png" 
                alt="Bubble" 
                style={{ 
                  height: '50px', 
                  filter: darkMode ? 'brightness(1.2)' : 'none' 
                }} 
              />
            </div>
            <h2 style={{
              color: accentColor,
              fontSize: '22px',
              fontWeight: '700',
              margin: '0',
              textAlign: 'center'
            }}>
              Welcome to zer0 Checker
            </h2>
          </div>
        ) : (
          // Desktop layout - side by side
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <img 
              src="/bubb.png" 
              alt="Bubble" 
              style={{ 
                height: '60px', 
                filter: darkMode ? 'brightness(1.2)' : 'none' 
              }} 
            />
            <h2 style={{
              color: accentColor,
              fontSize: '28px',
              fontWeight: '700',
              margin: '0'
            }}>
              Welcome to zer0 Checker
            </h2>
            <img 
              src="/bubb.png" 
              alt="Bubble" 
              style={{ 
                height: '60px', 
                filter: darkMode ? 'brightness(1.2)' : 'none' 
              }} 
            />
          </div>
        )}
        
        {/* Content */}
        <div style={{
          color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
          lineHeight: '1.6',
          fontSize: isMobile ? '14px' : '16px',
          textAlign: 'center',
          padding: isMobile ? '0 10px' : '0 20px',
          marginBottom: isMobile ? '20px' : '30px'
        }}>
          <div style={{
            backgroundColor: bubbleBg,
            padding: isMobile ? '15px' : '20px',
            borderRadius: '12px',
            marginBottom: isMobile ? '15px' : '20px',
            display: 'flex',
            gap: isMobile ? '8px' : '12px',
            alignItems: 'flex-start'
          }}>
            <Info size={isMobile ? 20 : 24} color={accentColor} style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, textAlign: 'left' }}>
              This is a Checker for interactions with the largest DEX on 0G Labs, 
              <strong style={{ color: accentColor }}> zer0_dex</strong>. 
              You can check your ranking by entering your wallet address in the lookup section!
            </p>
          </div>
          
          <p>
            View the leaderboard to see top wallets by interaction count, 
            track your progress, and see how you compare to other users.
          </p>
          
          <p style={{ marginTop: isMobile ? '8px' : '12px' }}>
            Interact with the live bubbles on screen to see fun animations while browsing the data!
          </p>
        </div>
        
        {/* Accept button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleDismiss}
            style={{
              background: darkMode ? 
                `linear-gradient(90deg, ${accentColor}, rgba(0, 184, 161, 0.8))` : 
                `linear-gradient(90deg, ${accentColor}, rgba(217, 82, 213, 0.8))`,
              color: '#FFFFFF',
              border: 'none',
              padding: isMobile ? '10px 24px' : '12px 32px',
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: '600',
              borderRadius: '24px',
              cursor: 'pointer',
              transition: 'transform 0.2s, opacity 0.2s',
              boxShadow: darkMode ? '0 4px 12px rgba(0, 230, 230, 0.2)' : '0 4px 12px rgba(224, 116, 221, 0.2)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSplash; 