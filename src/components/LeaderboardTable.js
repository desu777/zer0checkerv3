import React from 'react';
import { ChevronUp, ChevronDown, Copy } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { getStyles } from '../styles/leaderboardStyles';

const LeaderboardTable = ({ sortedData, sortBy, sortDirection, handleSort, formatDate, isSorting }) => {
  const { darkMode } = useTheme();
  const styles = getStyles(darkMode);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Optional: Show a temporary success message
        console.log('Address copied:', text);
      })
      .catch(err => {
        console.error('Failed to copy address:', err);
      });
  };

  // Helper to truncate wallet address
  const truncateAddress = (address) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Helper to format large numbers with commas
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Helper to determine if a wallet is in the top 3
  const isTopWallet = (index) => index < 3;

  // Responsive styles for mobile
  const tableResponsiveWrapperStyle = {
    overflowX: 'auto',
    width: '100%',
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
    scrollbarWidth: 'thin',
    marginBottom: '10px'
  };

  // Custom styles for mobile optimization
  const getMobileOptimizedTableStyles = () => {
    const mobileStyles = {...styles.table};
    return mobileStyles;
  };

  return (
    <div className={isSorting ? 'sorting-animation' : ''}>
      <div style={tableResponsiveWrapperStyle} className="table-wrapper">
        <table style={getMobileOptimizedTableStyles()}>
          <thead style={styles.tableHead}>
            <tr>
              <th 
                style={{
                  ...styles.tableHeader, 
                  ...(sortBy === 'rank' ? styles.tableHeaderActive : {}),
                  minWidth: '60px' // Ensure minimum width for rank column
                }}
                onClick={() => handleSort('rank')}
              >
                Rank
                {sortBy === 'rank' && (
                  <span style={styles.sortIcon}>
                    {sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                )}
              </th>
              <th 
                style={{
                  ...styles.tableHeader, 
                  ...(sortBy === 'address' ? styles.tableHeaderActive : {}),
                  minWidth: '140px' // Ensure minimum width for address column
                }}
                onClick={() => handleSort('address')}
              >
                Wallet
                {sortBy === 'address' && (
                  <span style={styles.sortIcon}>
                    {sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                )}
              </th>
              <th 
                style={{
                  ...styles.tableHeader, 
                  ...(sortBy === 'total_interactions' ? styles.tableHeaderActive : {}),
                  minWidth: '100px' // Ensure minimum width
                }}
                onClick={() => handleSort('total_interactions')}
              >
                Total
                {sortBy === 'total_interactions' && (
                  <span style={styles.sortIcon}>
                    {sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                )}
              </th>
              <th 
                style={{
                  ...styles.tableHeader, 
                  ...(sortBy === 'swap_interactions' ? styles.tableHeaderActive : {}),
                  minWidth: '80px' // Ensure minimum width
                }}
                onClick={() => handleSort('swap_interactions')}
              >
                Swaps
                {sortBy === 'swap_interactions' && (
                  <span style={styles.sortIcon}>
                    {sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                )}
              </th>
              <th 
                style={{
                  ...styles.tableHeader, 
                  ...(sortBy === 'pool_interactions' ? styles.tableHeaderActive : {}),
                  minWidth: '80px' // Ensure minimum width
                }}
                onClick={() => handleSort('pool_interactions')}
              >
                Pool
                {sortBy === 'pool_interactions' && (
                  <span style={styles.sortIcon}>
                    {sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                )}
              </th>
              <th 
                style={{
                  ...styles.tableHeader, 
                  ...(sortBy === 'first_interaction_date' ? styles.tableHeaderActive : {}),
                  minWidth: '140px' // Ensure minimum width for date column
                }}
                onClick={() => handleSort('first_interaction_date')}
              >
                First Interaction
                {sortBy === 'first_interaction_date' && (
                  <span style={styles.sortIcon}>
                    {sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                )}
              </th>
              <th 
                style={{
                  ...styles.tableHeader, 
                  ...(sortBy === 'last_interaction_date' ? styles.tableHeaderActive : {}),
                  minWidth: '140px' // Ensure minimum width for date column
                }}
                onClick={() => handleSort('last_interaction_date')}
              >
                Last Interaction
                {sortBy === 'last_interaction_date' && (
                  <span style={styles.sortIcon}>
                    {sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((wallet, index) => (
              <tr 
                key={wallet.address || index}
                style={{
                  ...(typeof styles.tableRow === 'function' ? styles.tableRow(index) : styles.tableRow),
                  ...(isTopWallet(index) ? styles.tableRowTop : {})
                }}
                data-row-index={index}
              >
                <td style={{...styles.tableCell, ...styles.rankCell, ...(isTopWallet(index) ? styles.rankTop : {})}}>
                  {index + 1}
                </td>
                <td style={{...styles.tableCell, ...styles.addressCell}}>
                  <a 
                    href={`https://sepolia.etherscan.io/address/${wallet.address}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.addressLink}
                  >
                    {truncateAddress(wallet.address)}
                  </a>
                  <button
                    onClick={() => copyToClipboard(wallet.address)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Copy address"
                  >
                    <Copy size={14} color={darkMode ? "#00D2E9" : "#E074DD"} />
                  </button>
                </td>
                <td style={{...styles.tableCell, ...styles.valueCell}}>{formatNumber(wallet.total_interactions || 0)}</td>
                <td style={styles.tableCell}>{formatNumber(wallet.swap_interactions || 0)}</td>
                <td style={styles.tableCell}>{formatNumber(wallet.pool_interactions || 0)}</td>
                <td style={styles.tableCell}>{formatDate(wallet.first_interaction_date)}</td>
                <td style={styles.tableCell}>{formatDate(wallet.last_interaction_date)}</td>
              </tr>
            ))}
            
            {sortedData.length === 0 && (
              <tr>
                <td colSpan={8} style={{...styles.tableCell, textAlign: 'center', padding: '20px'}}>
                  No wallet data available. Try again later.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Mobile hint - only shown on small screens */}
      <div style={{
        display: 'none',
        textAlign: 'center',
        color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
        fontSize: '12px',
        marginTop: '8px',
        '@media (max-width: 768px)': {
          display: 'block'
        }
      }}>
        <style>
          {`
            @media (max-width: 768px) {
              .mobile-scroll-hint {
                display: block !important;
              }
            }
          `}
        </style>
        <div className="mobile-scroll-hint">
          ← Scroll horizontally to see more data →
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTable; 