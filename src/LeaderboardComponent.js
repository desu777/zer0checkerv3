import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import StatsPanel from './components/StatsPanel';
import TimeRangeFilter from './components/TimeRangeFilter';
import LeaderboardTable from './components/LeaderboardTable';
import WalletLookup from './components/WalletLookup';
import Footer from './components/Footer';
import BackgroundBubbles from './components/BackgroundBubbles';
import BubbleCounter from './components/BubbleCounter';
import WelcomeSplash from './components/WelcomeSplash';
import { useTheme } from './ThemeContext';
import leaderboardService from './api/leaderboardService';
import { getStyles } from './styles/leaderboardStyles';

// Decorative lines component for dark mode
const DecorativeLines = () => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: -1,
    opacity: 0.2,
    pointerEvents: 'none'
  }}>
    <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="none">
      <path 
        d="M0,250 C250,100 350,300 500,150 S750,250 1000,100" 
        stroke="rgba(100, 200, 255, 0.6)" 
        fill="none" 
        strokeWidth="1.5" 
      />
      <path 
        d="M0,200 C200,50 400,250 600,100 S800,200 1000,50" 
        stroke="rgba(100, 200, 255, 0.5)" 
        fill="none" 
        strokeWidth="1.5" 
      />
    </svg>
  </div>
);

const LeaderboardComponent = () => {
  // Application state
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [stats, setStats] = useState({
    total_wallets: 0,
    total_interactions: 0,
    last_update: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('total_interactions');
  const [sortDirection, setSortDirection] = useState('desc');
  const [displayLimit, setDisplayLimit] = useState(10); // Initially show top 10
  const [expanded, setExpanded] = useState(false);
  const [isSorting, setIsSorting] = useState(false); // Track sorting state for animations
  
  // Get theme from context
  const { darkMode } = useTheme();
  
  // Theme-appropriate colors for buttons and UI elements
  const accentColor = darkMode ? '#00e6e6' : '#E074DD';
  const accentColorBg = darkMode ? 'rgba(0, 230, 230, 0.15)' : 'rgba(224, 116, 221, 0.15)';
  const accentColorBorder = darkMode ? 'rgba(0, 230, 230, 0.4)' : 'rgba(224, 116, 221, 0.4)';
  
  // Generate styles based on theme
  const styles = getStyles(darkMode);
  
  // Fetch leaderboard data
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log("Fetching leaderboard data...");
      // Always fetch 100 entries but only display according to displayLimit
      const result = await leaderboardService.getLeaderboard(100);
      
      if (result && result.wallets && Array.isArray(result.wallets)) {
        // Make sure all wallets have the required fields
        const processedWallets = result.wallets.map(wallet => ({
          ...wallet,
          // Ensure these fields exist with proper defaults
          total_interactions: wallet.total_interactions || 0,
          swap_interactions: wallet.swap_interactions || 0,
          pool_interactions: wallet.pool_interactions || 0,
          first_interaction_date: wallet.first_interaction_date || null,
          last_interaction_date: wallet.last_interaction_date || null,
          // Use update_time if available, otherwise fallback to last_interaction_date or current time
          update_time: wallet.update_time || wallet.last_interaction_date || new Date().toISOString()
        }));

        setLeaderboardData(processedWallets);
        console.log(`Processed ${processedWallets.length} wallet records`);
        
        // Use API stats if available, otherwise calculate from wallets data
        const apiStats = result.stats || {};
        setStats({
          total_wallets: apiStats.total_wallets || result.wallets.length,
          total_interactions: apiStats.total_interactions || 
                         result.wallets.reduce((sum, wallet) => sum + (wallet.total_interactions || 0), 0),
          last_update: apiStats.last_update || new Date().toISOString()
        });
      } else {
        console.error('Invalid API response format:', result);
        throw new Error('Invalid API response format. Expected wallets array.');
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError('Failed to load leaderboard data. Please try again later.');
      setIsLoading(false);
    }
  };

  // Handle sorting with animation
  const handleSort = (column) => {
    // Set sorting animation state
    setIsSorting(true);
    
    if (sortBy === column) {
      // Toggle sort direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending when changing columns
      setSortBy(column);
      setSortDirection('desc');
    }
    
    // Reset sorting animation state after a short delay
    setTimeout(() => {
      setIsSorting(false);
    }, 600); // Animation duration
  };

  // Get sorted data with limit
  const getSortedData = () => {
    if (!leaderboardData.length) return [];
    
    const sorted = [...leaderboardData].sort((a, b) => {
      // Handle undefined values
      const valueA = a[sortBy] !== undefined ? a[sortBy] : 0;
      const valueB = b[sortBy] !== undefined ? b[sortBy] : 0;
      
      // For numeric values
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'desc' 
          ? valueB - valueA 
          : valueA - valueB;
      }
      
      // For date values
      if (sortBy.includes('date') || sortBy === 'update_time') {
        // Convert to timestamps for comparison, or use 0 if invalid
        const timestampA = valueA ? new Date(valueA).getTime() : 0;
        const timestampB = valueB ? new Date(valueB).getTime() : 0;
        
        return sortDirection === 'desc'
          ? timestampB - timestampA
          : timestampA - timestampB;
      }
      
      // For string values
      return sortDirection === 'desc'
        ? String(valueB).localeCompare(String(valueA))
        : String(valueA).localeCompare(String(valueB));
    });
    
    // Return only the number of items according to displayLimit
    return sorted.slice(0, displayLimit);
  };

  const toggleExpand = () => {
    if (expanded) {
      setDisplayLimit(10);
      setExpanded(false);
    } else {
      setDisplayLimit(100);
      setExpanded(true);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';  // Invalid date
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div style={styles.appContainer}>
        {darkMode && <DecorativeLines />}
        <BackgroundBubbles />
        <Header />
        <div style={styles.contentContainer}>
          <div style={styles.loadingContainer}>
            <h2>Loading leaderboard data...</h2>
            <div style={styles.loadingBar}>
              <div style={styles.loadingBarInner}></div>
            </div>
            <style>{`
              @keyframes loading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(400%); }
              }
            `}</style>
            <p>Fetching and processing wallet data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.appContainer}>
        {darkMode && <DecorativeLines />}
        <BackgroundBubbles />
        <Header />
        <div style={styles.contentContainer}>
          <div style={styles.errorContainer}>
            <h2>An error occurred</h2>
            <p>{error}</p>
            <button 
              style={styles.retryButton} 
              onClick={fetchLeaderboardData}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sortedData = getSortedData();
  const totalAvailable = leaderboardData.length;

  return (
    <div style={styles.appContainer}>
      {darkMode && <DecorativeLines />}
      <BackgroundBubbles 
        isVerificationActive={false}
        onAllBubblesPopped={() => {}}
        resetVerification={0}
      />
      <Header />
      <MainMenu />
      <WelcomeSplash />

      {/* Global responsive styles */}
      <style>
        {`
          @media (max-width: 768px) {
            .stats-row {
              flex-direction: column !important;
              align-items: center !important;
            }
            .stat-card {
              width: 100% !important;
              min-width: auto !important;
              padding: 16px !important;
            }
            .content-container {
              padding: 0 10px !important;
              margin: 16px auto !important;
            }
            .panel {
              padding: 16px !important;
              margin-bottom: 16px !important;
              border-radius: 12px !important;
            }
            .table-wrapper {
              overflow-x: auto !important;
              width: 100% !important;
            }
          }
        `}
      </style>

      <div style={styles.socialLinks}>
        <a 
          href="https://github.com/desu777" 
          target="_blank" 
          rel="noopener noreferrer"
          style={styles.socialLink}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5808 20.2772 21.0498 21.7437 19.0074C23.2101 16.9651 23.9994 14.5143 24 12C24 5.37 18.63 0 12 0Z" fill="currentColor"/>
          </svg>
          @desu777
        </a>
        <a 
          href="https://x.com/nov3lolo" 
          target="_blank" 
          rel="noopener noreferrer"
          style={styles.socialLink}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" fill="currentColor"/>
          </svg>
          @nov3lolo
        </a>
      </div>

      <div style={styles.contentContainer} className="content-container">
        <div style={styles.panel} className="panel">
        
          {/* CSS for animations */}
          <style>{`
            @keyframes fadeInUp {
              from {
                opacity: 0.7;
                transform: translateY(8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .sorting-animation tbody tr {
              animation: fadeInUp 0.4s ease-out forwards;
              animation-delay: calc(0.03s * attr(data-row-index integer));
            }
            
            /* Fallback for browsers that don't support attr() in animation-delay */
            .sorting-animation tbody tr:nth-child(1) { animation-delay: 0.03s; }
            .sorting-animation tbody tr:nth-child(2) { animation-delay: 0.06s; }
            .sorting-animation tbody tr:nth-child(3) { animation-delay: 0.09s; }
            .sorting-animation tbody tr:nth-child(4) { animation-delay: 0.12s; }
            .sorting-animation tbody tr:nth-child(5) { animation-delay: 0.15s; }
            .sorting-animation tbody tr:nth-child(6) { animation-delay: 0.18s; }
            .sorting-animation tbody tr:nth-child(7) { animation-delay: 0.21s; }
            .sorting-animation tbody tr:nth-child(8) { animation-delay: 0.24s; }
            .sorting-animation tbody tr:nth-child(9) { animation-delay: 0.27s; }
            .sorting-animation tbody tr:nth-child(10) { animation-delay: 0.30s; }
          `}</style>
          
          <StatsPanel stats={stats} />
          
          <BubbleCounter />
          
          <TimeRangeFilter 
            formatDate={formatDate}
            stats={stats}
          />

          <div style={{...styles.lastUpdated, marginBottom: '16px'}}>
            <RefreshCw size={14} />
            Data is updated regularly to reflect the most recent interactions.
          </div>
          
          <WalletLookup formatDate={formatDate} />
          
          <LeaderboardTable 
            sortedData={sortedData}
            sortBy={sortBy}
            sortDirection={sortDirection}
            handleSort={handleSort}
            formatDate={formatDate}
            isSorting={isSorting}
          />
          
          {totalAvailable > 10 && (
            <div className="expand-button-container" style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
              marginBottom: '20px'
            }}>
              <button 
                style={styles.expandButton}
                onClick={toggleExpand}
                title={expanded ? "Show less" : "Show more"}
              >
                {expanded ? (
                  <>
                    <span>Show Top 10</span>
                    <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    <span>Show All ({totalAvailable})</span>
                    <ChevronDown size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LeaderboardComponent; 