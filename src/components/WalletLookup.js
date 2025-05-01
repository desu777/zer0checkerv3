import React, { useState, useEffect, useRef } from 'react';
import { Search, ExternalLink, AlertCircle, Trophy, Copy, CheckCircle2, Loader2, Shield, ShieldCheck } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { getStyles } from '../styles/leaderboardStyles';
import leaderboardService from '../api/leaderboardService';
import BackgroundBubbles from './BackgroundBubbles';

// Add toggle bubble styles
const bubbleStyles = `
  .bubble, .bubble:before, .bubble:after {
    transition-duration: 0.2s;
  }
  .bubble, .bubble:after {
    border-radius: 50%;
  }
  .bubble {
    background-image:
      radial-gradient(8% 8% at 22% 28%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
      radial-gradient(8% 8% at 23% 27%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
      radial-gradient(8% 8% at 24% 26%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
      radial-gradient(8% 8% at 25% 25%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
      radial-gradient(8% 8% at 26% 24%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
      radial-gradient(8% 8% at 27% 23%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%),
      radial-gradient(8% 8% at 28% 22%,hsl(0,0%,100%) 45%,hsla(0,0%,100%,0) 50%);
    cursor: pointer;
    position: relative;
    width: 46px;
    height: 46px;
    transform-style: preserve-3d;
    transition-property: box-shadow, transform, width, height;
    transition-timing-function: ease-in-out, ease-in-out, cubic-bezier(0.5,0.15,0.25,1.75), cubic-bezier(0.5,0.15,0.25,1.75);
    will-change: transform;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .bubble:before, .bubble:after {
    content: "";
    display: block;
    position: absolute;
    transition-timing-function: cubic-bezier(0.5,0.15,0.25,1.75);
  }
  
  .bubble:before {
    border-radius: 0.75em;
    box-shadow: 0 0 0 0.5em transparent inset;
    filter: drop-shadow(0.6em 0.6em 4px hsla(0,0%,0%,0.2));
    top: 50%;
    left: 50%;
    width: 1.5em;
    height: 1.5em;
    transform: translate3d(-50%,-50%,-1px);
    z-index: -1;
  }
  
  .bubble:focus, .bubble:hover {
    transform: scale(1.1);
    outline: none;
  }
  
  .bubble:focus:active, .bubble:hover:active {
    width: 50px;
    height: 40px;
  }
  
  .bubble:focus:before, .bubble:hover:before {
    filter: drop-shadow(0.75em 0.75em 4px hsla(0,0%,0%,0.2));
  }
  
  @keyframes float {
    from, to {
      transform: translate(0,3%);
    }
    25% {
      transform: translate(-3%,0);
    }
    50% {
      transform: translate(0,-3%);
    }
    75% {
      transform: translate(3%,0);
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const WalletLookup = ({ formatDate }) => {
  const { darkMode } = useTheme();
  const styles = getStyles(darkMode);
  
  // Theme-appropriate colors
  const accentColor = darkMode ? '#00e6e6' : '#E074DD';
  const accentColorBg = darkMode ? 'rgba(0, 230, 230, 0.15)' : 'rgba(224, 116, 221, 0.15)';
  const accentColorBorder = darkMode ? 'rgba(0, 230, 230, 0.4)' : 'rgba(224, 116, 221, 0.4)';
  const topRankColor = darkMode ? '#00B8A1' : '#E074DD';
  
  const [walletAddress, setWalletAddress] = useState('');
  const [walletDetails, setWalletDetails] = useState(null);
  const [walletRank, setWalletRank] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [bubbleActive, setBubbleActive] = useState(true);
  const [bubblePosition, setBubblePosition] = useState({ top: 0, left: 0 });
  
  // Verification state
  const [isVerified, setIsVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationReset, setVerificationReset] = useState(0);
  
  // Use ref to track verification state to prevent re-renders from causing issues
  const verificationStateRef = useRef({
    isVerified: false,
    inProgress: false
  });
  
  // Update the ref when state changes
  useEffect(() => {
    verificationStateRef.current.isVerified = isVerified;
    verificationStateRef.current.inProgress = showVerification;
  }, [isVerified, showVerification]);
  
  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  // Handle verification completion
  const handleVerificationComplete = () => {
    // Use a small timeout to prevent state update conflicts
    setTimeout(() => {
      setIsVerified(true);
      setShowVerification(false);
      verificationStateRef.current.isVerified = true;
      verificationStateRef.current.inProgress = false;
      
      // Auto-search if wallet address is already entered
      if (walletAddress && walletAddress.trim().length >= 8) {
        setTimeout(() => {
          handleSearch();
        }, 500);
      }
    }, 300);
  };
  
  // Handle verification reset (for testing or after timeout)
  const resetVerification = () => {
    setIsVerified(false);
    verificationStateRef.current.isVerified = false;
    setVerificationReset(prev => prev + 1);
  };
  
  // Start verification process
  const startVerification = () => {
    // Only start verification if it's not already in progress
    if (!verificationStateRef.current.inProgress) {
      setShowVerification(true);
      verificationStateRef.current.inProgress = true;
      setVerificationReset(prev => prev + 1);
    }
  };
  
  // Handle search with verification check
  const handleSearch = async () => {
    if (!walletAddress || walletAddress.trim().length < 8) {
      setError('Please enter a valid wallet address');
      return;
    }
    
    // Check if verification is required
    if (!verificationStateRef.current.isVerified) {
      startVerification();
      return;
    }
    
    // Add bubble animation effect
    setBubbleActive(false);
    setTimeout(() => setBubbleActive(true), 800);
    
    setIsLoading(true);
    setError('');
    setWalletDetails(null);
    setWalletRank(null);
    
    try {
      // Get wallet details
      const details = await leaderboardService.getWalletDetails(walletAddress);
      
      // Get wallet rank - this already gets all wallets
      const rankData = await leaderboardService.getWalletRank(walletAddress);
      
      if (!details) {
        setError('Wallet not found');
      } else {
        setWalletDetails(details);
        
        if (rankData && rankData.exists) {
          setWalletRank(rankData);
        }
      }
    } catch (err) {
      console.error('Error fetching wallet details:', err);
      setError('Failed to fetch wallet details');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Safe number formatting
  const safeFormat = (value) => {
    if (value === undefined || value === null) return '0';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Format rank display with medal emoji if in top 3
  const formatRank = (rank) => {
    if (!rank && rank !== 0) return 'N/A';
    
    let medal = '';
    if (rank === 1) medal = '🥇';
    else if (rank === 2) medal = '🥈';
    else if (rank === 3) medal = '🥉';
    
    // Format the rank number with spaces
    const formattedRank = rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    
    return medal ? `${formattedRank} ${medal}` : formattedRank;
  };

  // Clear the search when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setWalletAddress('');
        setError('');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Add a useEffect to randomize the bubble position when it becomes active again
  useEffect(() => {
    if (bubbleActive) {
      setBubblePosition({
        top: Math.random() * 4 - 2, // Random value between -2 and 2
        left: Math.random() * 4 - 2, // Random value between -2 and 2
      });
    }
  }, [bubbleActive]);
  
  // Reset verification after 10 minutes of inactivity
  useEffect(() => {
    let timer;
    if (isVerified) {
      timer = setTimeout(() => {
        resetVerification();
      }, 10 * 60 * 1000); // 10 minutes
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVerified]);

  return (
    <div style={{ 
      marginBottom: '24px',
      padding: '20px',
      backgroundColor: darkMode ? 'rgba(15, 15, 15, 0.5)' : 'rgba(250, 234, 250, 0.5)',
      borderRadius: '12px',
      boxShadow: darkMode ? '0 8px 16px rgba(0, 0, 0, 0.2)' : '0 8px 16px rgba(0, 0, 0, 0.05)',
      border: `1px solid ${darkMode ? 'rgba(40, 40, 40, 0.6)' : 'rgba(224, 116, 221, 0.2)'}`,
      transition: 'all 0.3s ease',
      position: 'relative' // Add for verification overlay positioning
    }}>
      {/* Verification overlay */}
      {showVerification && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
        }}>
          <BackgroundBubbles 
            onAllBubblesPopped={handleVerificationComplete}
            isVerificationActive={true}
            resetVerification={verificationReset}
          />
        </div>
      )}
    
      <h3 style={{ 
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '16px',
        color: darkMode ? accentColor : styles.statValue.color,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Trophy size={18} />
        Checker
        {isVerified && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: darkMode ? 'rgba(0, 230, 230, 0.15)' : 'rgba(224, 116, 221, 0.15)',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'normal',
            color: accentColor,
            marginLeft: '6px'
          }}>
            <ShieldCheck size={12} style={{ marginRight: '4px' }} />
            Verified
          </span>
        )}
      </h3>
      
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: darkMode ? 'rgba(195, 195, 205, 0.8)' : 'rgba(92, 76, 92, 0.8)',
            marginBottom: '4px'
          }}>
            Enter a wallet address to check its stats and ranking
          </div>
          
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ 
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              position: 'relative',
              border: `none`,
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: `
                0 -0.03em 0.05em ${darkMode ? 'hsl(180,90%,100%)' : 'hsl(302,90%,100%)'} inset,
                0 -0.08em 0.2em ${darkMode ? 'hsl(180,90%,45%)' : 'hsl(302,90%,45%)'} inset,
                0 0.03em 0.03em ${darkMode ? 'hsl(180,90%,45%)' : 'hsl(302,90%,45%)'} inset,
                0.03em 0 0.05em ${darkMode ? 'hsl(180,90%,100%)' : 'hsl(302,90%,100%)'} inset,
                -0.03em 0 0.05em ${darkMode ? 'hsl(180,90%,100%)' : 'hsl(302,90%,100%)'} inset,
                0 0.05em 0.2em ${darkMode ? 'hsl(180,90%,60%)' : 'hsl(302,90%,60%)'} inset,
                0 4px 10px rgba(0, 0, 0, 0.1)
              `,
              transition: 'all 0.3s ease',
              transform: inputFocused ? 'scale(1.02)' : 'scale(1)',
              backgroundColor: darkMode ? 'rgba(28, 23, 28, 0.7)' : 'rgba(255, 255, 255, 0.9)',
            }}>
              <div style={{ 
                padding: '0 16px', 
                display: 'flex', 
                alignItems: 'center',
                color: inputFocused ? (darkMode ? '#00e6e6' : '#E074DD') : (darkMode ? 'rgba(195, 195, 205, 0.5)' : 'rgba(92, 76, 92, 0.5)')
              }}>
                <Search size={16} />
              </div>
              <input 
                type="text"
                placeholder="Enter wallet address (0x...)"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                style={{
                  width: '100%',
                  padding: '12px 0 12px 4px',
                  fontSize: '15px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: darkMode ? styles.tableCell.color : styles.tableCell.color,
                  transition: 'all 0.2s ease'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              {walletAddress && (
                <button
                  onClick={() => setWalletAddress('')}
                  style={{
                    position: 'relative',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: darkMode ? 'rgba(195, 195, 205, 0.5)' : 'rgba(92, 76, 92, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease',
                    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = darkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)'}
                >
                  ×
                </button>
              )}
            </div>
            
            <div
              className="bubble"
              onClick={handleSearch}
              style={{
                boxShadow: `
                  0 -0.06em 0.1em ${darkMode ? 'hsl(180,90%,100%)' : 'hsl(302,90%,100%)'} inset,
                  0 -0.15em 0.4em ${darkMode ? 'hsl(180,90%,45%)' : 'hsl(302,90%,45%)'} inset,
                  0 0.05em 0.05em ${darkMode ? 'hsl(180,90%,45%)' : 'hsl(302,90%,45%)'} inset,
                  0.05em 0 0.1em ${darkMode ? 'hsl(180,90%,100%)' : 'hsl(302,90%,100%)'} inset,
                  -0.05em 0 0.1em ${darkMode ? 'hsl(180,90%,100%)' : 'hsl(302,90%,100%)'} inset,
                  0 0.1em 0.4em ${darkMode ? 'hsl(180,90%,60%)' : 'hsl(302,90%,60%)'} inset
                `,
                backgroundColor: darkMode ? 'rgba(0, 230, 230, 0.15)' : 'rgba(224, 116, 221, 0.15)',
                opacity: isLoading ? 0.8 : (bubbleActive ? 1 : 0),
                animation: 'float 4s ease-in-out infinite',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transform: bubbleActive ? `translate(${bubblePosition.left}px, ${bubblePosition.top}px)` : 'scale(0.8)',
                transition: 'opacity 0.3s ease, transform 0.5s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
                width: 'auto',
                padding: '0 15px'
              }}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" style={{ color: darkMode ? '#00e6e6' : '#E074DD' }} />
              ) : (
                <span style={{ color: darkMode ? '#00e6e6' : '#E074DD' }}>Check</span>
              )}
            </div>
            
            <style>{bubbleStyles}</style>
          </div>
          
          {!isVerified && !showVerification && walletAddress && walletAddress.trim().length >= 8 && (
            <div style={{
              marginTop: '8px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: accentColor,
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: darkMode ? 'rgba(0, 230, 230, 0.08)' : 'rgba(224, 116, 221, 0.08)',
              cursor: 'pointer'
            }}
            onClick={startVerification}
            >
              <Shield size={16} />
              <span>Anti-bot verification required. Click here to verify.</span>
            </div>
          )}
        </div>
        
        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: darkMode ? 'rgba(254, 78, 82, 0.15)' : 'rgba(254, 78, 82, 0.1)',
            color: '#FE4E52',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            animation: 'fadeIn 0.3s ease-out forwards'
          }}>
            <AlertCircle size={20} />
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Wallet Not Found</div>
              <div>{error}</div>
            </div>
          </div>
        )}
        
        {isLoading && !error && (
          <div style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            animation: 'fadeIn 0.3s ease-out forwards'
          }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: `3px solid ${accentColorBg}`,
                borderTopColor: accentColor,
                animation: 'spin 1s linear infinite'
              }}
            />
            <div style={{ color: darkMode ? styles.tableCell.color : styles.tableCell.color }}>
              Searching for wallet details...
            </div>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}</style>
          </div>
        )}
        
        {walletDetails && !isLoading && (
          <div style={{
            padding: '20px',
            backgroundColor: darkMode ? 'rgba(28, 23, 28, 0.7)' : styles.statCard.backgroundColor,
            borderRadius: '12px',
            boxShadow: darkMode ? '0 6px 12px rgba(0, 0, 0, 0.2)' : '0 6px 12px rgba(0, 0, 0, 0.05)',
            border: `1px solid ${darkMode ? 'rgba(40, 40, 40, 0.8)' : accentColorBorder}`,
            animation: 'fadeInUp 0.3s ease-out forwards',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              borderBottom: `1px solid ${darkMode ? 'rgba(60, 60, 60, 0.5)' : 'rgba(224, 116, 221, 0.2)'}`,
              paddingBottom: '16px'
            }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: accentColor,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Wallet Profile
                
                {walletRank && walletRank.exists && walletRank.rank <= 3 && (
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: darkMode ? 'rgba(0, 184, 161, 0.2)' : 'rgba(224, 116, 221, 0.2)',
                    color: topRankColor,
                  }}>
                    Top {walletRank.rank} 
                    {walletRank.rank === 1 ? '🥇' : walletRank.rank === 2 ? '🥈' : '🥉'}
                  </span>
                )}
              </h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => copyAddress(walletDetails.address)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: darkMode ? 'rgba(40, 40, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    border: `1px solid ${darkMode ? 'rgba(60, 60, 60, 0.8)' : 'rgba(224, 116, 221, 0.3)'}`,
                    cursor: 'pointer',
                    position: 'relative',
                    color: accentColor
                  }}
                >
                  {isCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  {showTooltip && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      zIndex: 10
                    }}>
                      {isCopied ? 'Copied!' : 'Copy address'}
                    </div>
                  )}
                </button>
                <a 
                  href={`https://chainscan-galileo.0g.ai/address/${walletDetails.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: darkMode ? 'rgba(40, 40, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    border: `1px solid ${darkMode ? 'rgba(60, 60, 60, 0.8)' : 'rgba(224, 116, 221, 0.3)'}`,
                    color: accentColor
                  }}
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'center'
              }}>
                <div style={{ 
                  padding: '8px 16px',
                  backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '8px',
                  border: `1px solid ${darkMode ? 'rgba(60, 60, 60, 0.5)' : 'rgba(224, 116, 221, 0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{ 
                    fontWeight: '500',
                    color: darkMode ? 'rgba(195, 195, 205, 0.7)' : 'rgba(92, 76, 92, 0.8)',
                  }}>
                    Address:
                  </div>
                  <div style={{ 
                    fontWeight: '600',
                    color: darkMode ? '#fff' : '#000'
                  }}>
                    {formatWalletAddress(walletDetails.address)}
                  </div>
                </div>
                
                {walletRank && walletRank.exists && (
                  <div style={{ 
                    padding: '8px 16px',
                    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '8px',
                    border: `1px solid ${darkMode ? 'rgba(60, 60, 60, 0.5)' : 'rgba(224, 116, 221, 0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Trophy size={16} color={walletRank.rank <= 3 ? topRankColor : undefined} />
                    <div style={{ 
                      fontWeight: '500',
                      color: darkMode ? 'rgba(195, 195, 205, 0.7)' : 'rgba(92, 76, 92, 0.8)',
                    }}>
                      Rank:
                    </div>
                    <div style={{ 
                      fontWeight: '700',
                      color: walletRank.rank <= 3 ? topRankColor : (darkMode ? '#fff' : '#000')
                    }}>
                      {formatRank(walletRank.rank)}
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '16px'
              }}>
                <div style={{
                  padding: '16px',
                  backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '10px',
                  border: `1px solid ${darkMode ? 'rgba(60, 60, 60, 0.5)' : 'rgba(224, 116, 221, 0.2)'}`,
                }}>
                  <div style={{ 
                    fontSize: '13px', 
                    color: darkMode ? 'rgba(195, 195, 205, 0.7)' : 'rgba(92, 76, 92, 0.7)',
                    marginBottom: '6px'
                  }}>
                    Total Interactions
                  </div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    color: accentColor 
                  }}>
                    {safeFormat(walletDetails.total_interactions)}
                  </div>
                </div>
                
                <div style={{
                  padding: '16px',
                  backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '10px',
                  border: `1px solid ${darkMode ? 'rgba(60, 60, 60, 0.5)' : 'rgba(224, 116, 221, 0.2)'}`,
                }}>
                  <div style={{ 
                    fontSize: '13px', 
                    color: darkMode ? 'rgba(195, 195, 205, 0.7)' : 'rgba(92, 76, 92, 0.7)',
                    marginBottom: '6px'
                  }}>
                    Swaps
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '700' }}>
                    {safeFormat(walletDetails.swap_interactions)}
                  </div>
                </div>
                
                <div style={{
                  padding: '16px',
                  backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '10px',
                  border: `1px solid ${darkMode ? 'rgba(60, 60, 60, 0.5)' : 'rgba(224, 116, 221, 0.2)'}`,
                }}>
                  <div style={{ 
                    fontSize: '13px', 
                    color: darkMode ? 'rgba(195, 195, 205, 0.7)' : 'rgba(92, 76, 92, 0.7)',
                    marginBottom: '6px'
                  }}>
                    Pools
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '700' }}>
                    {safeFormat(walletDetails.pool_interactions)}
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '16px'
              }}>
                <div style={{
                  padding: '14px',
                  backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)',
                  borderRadius: '10px'
                }}>
                  <div style={{ 
                    fontSize: '13px', 
                    color: darkMode ? 'rgba(195, 195, 205, 0.7)' : 'rgba(92, 76, 92, 0.7)',
                    marginBottom: '6px'
                  }}>
                    First Seen
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {formatDate(walletDetails.first_interaction_date)}
                  </div>
                </div>
                
                <div style={{
                  padding: '14px',
                  backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)',
                  borderRadius: '10px'
                }}>
                  <div style={{ 
                    fontSize: '13px', 
                    color: darkMode ? 'rgba(195, 195, 205, 0.7)' : 'rgba(92, 76, 92, 0.7)',
                    marginBottom: '6px'
                  }}>
                    Last Seen
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {formatDate(walletDetails.last_interaction_date)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletLookup; 