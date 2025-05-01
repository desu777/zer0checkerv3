import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { getStyles } from '../styles/leaderboardStyles';
import { RefreshCw } from 'lucide-react';

const BubbleCounter = () => {
  const { darkMode } = useTheme();
  const styles = getStyles(darkMode);
  const [bubbleStats, setBubbleStats] = useState({
    totalPopped: 0,
    todayPopped: 0,
    streak: 0,
    lastPopDate: null
  });

  // Load bubble stats from localStorage on component mount
  useEffect(() => {
    const loadBubbleStats = () => {
      const savedStats = localStorage.getItem('zer0_bubble_stats');
      if (savedStats) {
        const parsedStats = JSON.parse(savedStats);
        
        // Check if we need to reset the daily counter
        const lastPopDate = parsedStats.lastPopDate ? new Date(parsedStats.lastPopDate) : null;
        const today = new Date();
        const isNewDay = lastPopDate && 
          (lastPopDate.getDate() !== today.getDate() || 
           lastPopDate.getMonth() !== today.getMonth() || 
           lastPopDate.getFullYear() !== today.getFullYear());
        
        // Calculate streak
        let streak = parsedStats.streak || 0;
        if (isNewDay) {
          // Reset today's counter on a new day
          parsedStats.todayPopped = 0;
          
          // Check streak - if last pop was yesterday, increment streak
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const wasYesterday = lastPopDate && 
            lastPopDate.getDate() === yesterday.getDate() &&
            lastPopDate.getMonth() === yesterday.getMonth() &&
            lastPopDate.getFullYear() === yesterday.getFullYear();
            
          if (!wasYesterday) {
            // Reset streak if not consecutive days
            streak = 0;
          }
        }
        
        setBubbleStats({
          ...parsedStats,
          streak
        });
      }
    };
    
    loadBubbleStats();
    
    // Listen for bubble popping events
    const handleBubblePop = () => {
      setBubbleStats(prevStats => {
        const now = new Date();
        const newStats = {
          totalPopped: (prevStats.totalPopped || 0) + 1,
          todayPopped: (prevStats.todayPopped || 0) + 1,
          streak: prevStats.streak || 0,
          lastPopDate: now.toISOString()
        };
        
        // If this is the first pop today and there was a previous pop date, check for streak
        if (prevStats.todayPopped === 0 && prevStats.lastPopDate) {
          const lastDate = new Date(prevStats.lastPopDate);
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          
          const wasYesterday = 
            lastDate.getDate() === yesterday.getDate() &&
            lastDate.getMonth() === yesterday.getMonth() &&
            lastDate.getFullYear() === yesterday.getFullYear();
            
          if (wasYesterday || prevStats.todayPopped === 0) {
            // Increment streak if popping happened yesterday or this is first pop today
            newStats.streak += 1;
          }
        }
        
        // Save to localStorage
        localStorage.setItem('zer0_bubble_stats', JSON.stringify(newStats));
        return newStats;
      });
    };
    
    // Attach the event listener for bubble pops
    window.addEventListener('bubble_popped', handleBubblePop);
    
    // Clean up
    return () => {
      window.removeEventListener('bubble_popped', handleBubblePop);
    };
  }, []);
  
  // Styles for the bubble stats container
  const bubbleStatsStyle = {
    marginTop: '20px',
    marginBottom: '20px',
    padding: '16px',
    borderRadius: '16px',
    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(252, 242, 252, 0.7)',
    border: darkMode ? '1px solid rgba(0, 230, 230, 0.15)' : '1px solid rgba(224, 116, 221, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };
  
  const bubbleTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: darkMode ? '#00e6e6' : '#E074DD',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };
  
  const bubbleStatsRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px'
  };
  
  const bubbleStatItemStyle = {
    flex: '1 1 calc(33% - 12px)',
    minWidth: '100px',
    padding: '12px',
    borderRadius: '12px',
    backgroundColor: darkMode ? 'rgba(0, 210, 233, 0.1)' : 'rgba(224, 116, 221, 0.1)',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      flex: '1 1 100%',
    }
  };
  
  const bubbleStatValueStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: darkMode ? '#00D2E9' : '#E074DD',
    marginBottom: '4px'
  };
  
  const bubbleStatLabelStyle = {
    fontSize: '14px',
    color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
  };

  // Character banner styles
  const characterBannerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '10px',
    background: darkMode ? 
      'linear-gradient(90deg, rgba(0, 210, 233, 0.1), rgba(0, 0, 0, 0))' : 
      'linear-gradient(90deg, rgba(224, 116, 221, 0.1), rgba(255, 255, 255, 0))',
    borderRadius: '12px'
  };
  
  const characterImageStyle = {
    width: '160px',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '80px',
    border: darkMode ? '2px solid rgba(0, 210, 233, 0.3)' : '2px solid rgba(224, 116, 221, 0.3)',
    '@media (max-width: 480px)': {
      width: '130px',
      height: '130px'
    }
  };
  
  const characterTextStyle = {
    color: darkMode ? '#00e6e6' : '#E074DD',
    fontWeight: '600',
    fontSize: '18px',
    maxWidth: '200px',
    '@media (max-width: 480px)': {
      fontSize: '16px',
      textAlign: 'center'
    }
  };
  
  // Style for the bubb image
  const bubbImageStyle = {
    width: '24px',
    height: '24px',
    marginRight: '8px'
  };
  
  return (
    <div style={bubbleStatsStyle} className="bubble-stats-container">
      <div style={characterBannerStyle} className="character-banner">
        <img 
          src="/zer0.png" 
          alt="Zer0 character" 
          style={characterImageStyle}
          className="character-image"
        />
        <div style={characterTextStyle}>
          Pop bubbles with zer0!
        </div>
      </div>
      
      <div style={bubbleTitleStyle}>
        <img 
          src="/bubb.png" 
          alt="Bubble" 
          style={bubbImageStyle} 
        />
        Your Bubble Popping Stats
      </div>
      
      <div style={bubbleStatsRowStyle} className="bubble-stats-row">
        <div style={bubbleStatItemStyle} className="bubble-stat-item">
          <div style={bubbleStatValueStyle}>{bubbleStats.totalPopped}</div>
          <div style={bubbleStatLabelStyle}>Total Popped</div>
        </div>
        
        <div style={bubbleStatItemStyle} className="bubble-stat-item">
          <div style={bubbleStatValueStyle}>{bubbleStats.todayPopped}</div>
          <div style={bubbleStatLabelStyle}>Today's Pops</div>
        </div>
        
        <div style={bubbleStatItemStyle} className="bubble-stat-item">
          <div style={bubbleStatValueStyle}>{bubbleStats.streak}</div>
          <div style={bubbleStatLabelStyle}>Day Streak</div>
        </div>
      </div>
      
      <div style={{ fontSize: '12px', textAlign: 'center', color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>
        Pop more bubbles to increase your stats!
      </div>
    </div>
  );
};

export default BubbleCounter; 