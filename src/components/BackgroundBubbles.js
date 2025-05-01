import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../ThemeContext';

const BackgroundBubbles = ({ onAllBubblesPopped, isVerificationActive, resetVerification }) => {
  const { darkMode } = useTheme();
  const [bubbles, setBubbles] = useState([]);
  const [points, setPoints] = useState(0);
  const TOTAL_POINTS_REQUIRED = 10;
  
  // Use refs to track already popped bubbles and prevent double counting
  const poppedBubblesRef = useRef(new Set());
  const verificationStartedRef = useRef(false);
  
  // Reset popped bubbles tracker when verification state changes
  useEffect(() => {
    if (isVerificationActive) {
      verificationStartedRef.current = true;
      poppedBubblesRef.current = new Set();
      setPoints(0);
    } else {
      verificationStartedRef.current = false;
    }
  }, [isVerificationActive]);
  
  // Create verification bubbles of different sizes
  const createVerificationBubbles = useCallback(() => {
    // Define specific sizes for a better visual hierarchy
    const leftSizes = [45, 65, 85, 55, 75];
    const rightSizes = [70, 50, 80, 60, 40];
    
    // Accent colors - increased opacity for both modes, especially dark mode
    const accentColorBg = darkMode ? 'rgba(0, 230, 230, 0.35)' : 'rgba(224, 116, 221, 0.4)';
    
    const leftBubbles = leftSizes.map((size, i) => ({
      id: `left-${i}`,
      size: size,
      top: 15 + (i * 15), // Distribute vertically with some spacing
      left: 2 + Math.floor(Math.random() * 10), // Slightly randomize horizontal position
      animationDelay: Math.random() * 3, // Random animation delay
      animationDuration: 4 + Math.random() * 3, // Random duration between 4-7s
      opacity: darkMode ? (0.5 + (size/200)) : (0.5 + (size/200)), // Higher opacity in dark mode
      side: 'left',
      backgroundColor: accentColorBg,
      visible: true,
      popped: false,
      points: 1 // Each bubble is worth 1 point
    }));
    
    const rightBubbles = rightSizes.map((size, i) => ({
      id: `right-${i}`,
      size: size,
      top: 20 + (i * 15), // Distribute vertically with some spacing
      right: 2 + Math.floor(Math.random() * 10), // Slightly randomize horizontal position
      animationDelay: Math.random() * 3, // Random animation delay
      animationDuration: 4 + Math.random() * 3, // Random duration between 4-7s
      opacity: darkMode ? (0.5 + (size/200)) : (0.5 + (size/200)), // Higher opacity in dark mode
      side: 'right',
      backgroundColor: accentColorBg,
      visible: true,
      popped: false,
      points: 1 // Each bubble is worth 1 point
    }));
    
    return [...leftBubbles, ...rightBubbles];
  }, [darkMode]);
  
  // Create random decorative bubbles
  const createDecorativeBubbles = useCallback(() => {
    const accentColorBg = darkMode ? 'rgba(0, 230, 230, 0.25)' : 'rgba(224, 116, 221, 0.35)';
    
    const leftBubbles = Array.from({ length: 5 }, (_, i) => ({
      id: `left-${i}`,
      size: Math.floor(Math.random() * 90) + 40, // Random size between 40px and 130px
      top: Math.floor(Math.random() * 80) + 10, // Random position
      left: Math.floor(Math.random() * 15), // Keep on left side
      animationDelay: Math.random() * 8, // Random animation delay
      animationDuration: Math.random() * 6 + 4, // Random duration between 4-10s
      opacity: darkMode ? (Math.random() * 0.25 + 0.2) : (Math.random() * 0.3 + 0.2), // Higher opacity for dark mode
      side: 'left',
      backgroundColor: accentColorBg,
      visible: true,
      popped: false,
      decorative: true
    }));
    
    const rightBubbles = Array.from({ length: 5 }, (_, i) => ({
      id: `right-${i}`,
      size: Math.floor(Math.random() * 90) + 40, // Random size between 40px and 130px
      top: Math.floor(Math.random() * 80) + 10, // Random position
      right: Math.floor(Math.random() * 15), // Keep on right side
      animationDelay: Math.random() * 8, // Random animation delay
      animationDuration: Math.random() * 6 + 4, // Random duration between 4-10s
      opacity: darkMode ? (Math.random() * 0.25 + 0.2) : (Math.random() * 0.3 + 0.2), // Higher opacity for dark mode
      side: 'right',
      backgroundColor: accentColorBg,
      visible: true,
      popped: false,
      decorative: true
    }));
    
    return [...leftBubbles, ...rightBubbles];
  }, [darkMode]);

  // Initialize bubbles based on verification state
  useEffect(() => {
    // Only recreate bubbles if verification mode changes or resetVerification changes
    if (isVerificationActive) {
      // Create verification bubbles
      const newBubbles = createVerificationBubbles();
      setBubbles(newBubbles);
      setPoints(0);
      poppedBubblesRef.current = new Set();
    } else {
      // Create decorative bubbles
      const newBubbles = createDecorativeBubbles();
      setBubbles(newBubbles);
    }
  }, [isVerificationActive, createVerificationBubbles, createDecorativeBubbles, resetVerification]);
  
  // Check if enough points have been collected
  useEffect(() => {
    if (isVerificationActive && verificationStartedRef.current && points >= TOTAL_POINTS_REQUIRED) {
      // Player has earned enough points
      setTimeout(() => {
        onAllBubblesPopped();
      }, 500);
    }
  }, [points, isVerificationActive, onAllBubblesPopped]);
  
  // Handle bubble click/pop
  const handleBubblePop = (bubbleId) => {
    // Prevent double-counting by checking if this bubble was already popped
    if (poppedBubblesRef.current.has(bubbleId)) {
      return;
    }
    
    // Add to popped bubbles set to prevent double counting
    poppedBubblesRef.current.add(bubbleId);
    
    // Dispatch a custom event for the bubble counter
    const bubblePopEvent = new Event('bubble_popped');
    window.dispatchEvent(bubblePopEvent);
    
    setBubbles(prevBubbles => {
      const updatedBubbles = prevBubbles.map(bubble => {
        if (bubble.id === bubbleId && !bubble.popped) {
          // Only count non-decorative bubbles for verification and add points
          if (!bubble.decorative && isVerificationActive) {
            // Increment points once per bubble
            setPoints(prev => prev + (bubble.points || 1));
          }
          return { ...bubble, popped: true, visible: false };
        }
        return bubble;
      });
      return updatedBubbles;
    });
    
    // If not in verification mode, create a new bubble after some delay
    if (!isVerificationActive) {
      setTimeout(() => {
        // Remove from popped bubbles set when regenerating in non-verification mode
        poppedBubblesRef.current.delete(bubbleId);
        
        setBubbles(prevBubbles => {
          // Find the index of the popped bubble
          const bubbleIndex = prevBubbles.findIndex(b => b.id === bubbleId);
          if (bubbleIndex === -1) return prevBubbles;
          
          const poppedBubble = prevBubbles[bubbleIndex];
          
          // Create a new bubble with same id but different position
          const accentColorBg = darkMode ? 'rgba(0, 230, 230, 0.15)' : 'rgba(224, 116, 221, 0.35)';
          const newBubble = {
            ...poppedBubble,
            top: Math.floor(Math.random() * 80) + 10,
            ...(poppedBubble.side === 'left' 
              ? { left: Math.floor(Math.random() * 15) } 
              : { right: Math.floor(Math.random() * 15) }
            ),
            size: Math.floor(Math.random() * 90) + 40,
            popped: false,
            visible: true,
            opacity: darkMode ? (Math.random() * 0.15 + 0.1) : (Math.random() * 0.3 + 0.2),
            backgroundColor: accentColorBg
          };
          
          // Replace the old bubble
          const newBubbles = [...prevBubbles];
          newBubbles[bubbleIndex] = newBubble;
          return newBubbles;
        });
      }, 800);
    }
  };
  
  // Theme-appropriate bubble styles with more vibrant colors
  const getBubbleColor = (darkMode, isVerification) => {
    const intensityFactor = isVerification ? '100%' : '95%';
    const glowOpacity = isVerification ? '0.6' : '0.45';
    
    // More intense colors for light mode
    const lightModeIntensity = isVerification ? '100%' : '98%';
    const lightModeGlow = isVerification ? '0.7' : '0.55';
    
    return darkMode 
      ? `0 -0.06em 0.1em hsl(180,95%,100%) inset,
         0 -0.15em 0.5em hsl(180,${intensityFactor},50%) inset,
         0 0.05em 0.05em hsl(180,${intensityFactor},50%) inset,
         0.05em 0 0.1em hsl(180,95%,100%) inset,
         -0.05em 0 0.1em hsl(180,95%,100%) inset,
         0 0.1em 0.5em hsl(180,${intensityFactor},65%) inset,
         0 0 20px rgba(0, 230, 230, ${glowOpacity}),
         0 0 1px rgba(255, 255, 255, 0.8)`
      : `0 -0.06em 0.1em hsl(302,98%,100%) inset,
         0 -0.15em 0.5em hsl(302,${lightModeIntensity},55%) inset,
         0 0.05em 0.05em hsl(302,${lightModeIntensity},55%) inset,
         0.05em 0 0.1em hsl(302,98%,100%) inset,
         -0.05em 0 0.1em hsl(302,98%,100%) inset,
         0 0.1em 0.5em hsl(302,${lightModeIntensity},70%) inset,
         0 0 18px rgba(224, 116, 221, ${lightModeGlow})`;
  };

  // Debug display - only show in dev environment
  const debugInfo = process.env.NODE_ENV === 'development' ? (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      Points: {points}, 
      Bubbles popped: {poppedBubblesRef.current.size}, 
      Verification: {isVerificationActive ? 'Active' : 'Inactive'}
    </div>
  ) : null;

  return (
    <>
      {bubbles.map(bubble => (
        <div 
          key={bubble.id}
          className={`background-bubble ${isVerificationActive ? 'verification-bubble' : ''} ${bubble.popped ? 'popped' : ''} ${!darkMode ? 'light-mode-bubble' : ''}`}
          onClick={() => !bubble.popped && handleBubblePop(bubble.id)}
          style={{
            position: 'fixed',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            top: `${bubble.top}%`,
            ...(bubble.side === 'left' ? { left: `${bubble.left}%` } : { right: `${bubble.right}%` }),
            boxShadow: getBubbleColor(darkMode, isVerificationActive && !bubble.decorative),
            animationDelay: `${bubble.animationDelay}s`,
            animationDuration: `${bubble.animationDuration}s`,
            opacity: bubble.visible ? bubble.opacity : 0,
            zIndex: isVerificationActive && !bubble.decorative ? 10 : 0,
            backgroundColor: bubble.backgroundColor,
            cursor: 'pointer',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            pointerEvents: bubble.popped ? 'none' : 'auto'
          }}
        />
      ))}
      
      {isVerificationActive && (
        <div className="verification-instructions">
          <div className="verification-bubble-counter">
            {points}/{TOTAL_POINTS_REQUIRED} points
          </div>
          <p>Pop all bubbles to verify you're human</p>
        </div>
      )}
      
      {debugInfo}
      
      <style jsx>{`
        .background-bubble {
          background-image:
            radial-gradient(8% 8% at 22% 28%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
            radial-gradient(8% 8% at 23% 27%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
            radial-gradient(8% 8% at 24% 26%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
            radial-gradient(8% 8% at 25% 25%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
            radial-gradient(8% 8% at 26% 24%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
            radial-gradient(8% 8% at 27% 23%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
            radial-gradient(8% 8% at 28% 22%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%);
          border-radius: 50%;
          animation: float ease-in-out infinite;
          filter: blur(0.5px);
          transform-origin: center;
          border: 1px solid rgba(0, 230, 230, 0.3);
        }
        
        .background-bubble:hover {
          filter: blur(0);
          transform: scale(1.05);
          border: 1px solid rgba(0, 230, 230, 0.5);
        }
        
        .verification-bubble {
          animation: float-verification ease-in-out infinite;
          filter: blur(0);
          border: 1px solid rgba(0, 230, 230, 0.5);
        }
        
        .verification-bubble:hover {
          transform: scale(1.1);
          border: 1px solid rgba(0, 230, 230, 0.7);
        }
        
        /* Add a special class for light mode bubbles */
        .light-mode-bubble {
          box-shadow: 0 0 20px rgba(224, 116, 221, 0.5);
          border: 1px solid rgba(224, 116, 221, 0.3);
        }
        
        .light-mode-bubble:hover {
          border: 1px solid rgba(224, 116, 221, 0.5);
        }
        
        .popped {
          animation: pop 0.4s ease-out forwards !important;
        }
        
        .verification-instructions {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: ${darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
          color: ${darkMode ? '#fff' : '#333'};
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 0 20px ${darkMode ? 'rgba(0, 230, 230, 0.3)' : 'rgba(224, 116, 221, 0.3)'};
          z-index: 5;
        }
        
        .verification-bubble-counter {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
          color: ${darkMode ? '#00e6e6' : '#E074DD'};
        }
        
        @keyframes float {
          from, to {
            transform: translate(0,3%) rotate(0deg);
          }
          25% {
            transform: translate(-3%,0) rotate(2deg);
          }
          50% {
            transform: translate(0,-3%) rotate(0deg);
          }
          75% {
            transform: translate(3%,0) rotate(-2deg);
          }
        }
        
        @keyframes float-verification {
          from, to {
            transform: translate(0,2%);
          }
          50% {
            transform: translate(0,-2%);
          }
        }
        
        @keyframes pop {
          0% { transform: scale(1); opacity: 0.8; }
          20% { transform: scale(1.2); opacity: 0.6; }
          100% { transform: scale(0); opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default BackgroundBubbles; 