import React from 'react';
import { Trophy, DollarSign, Clock } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { getStyles } from '../styles/leaderboardStyles';

const StatsPanel = ({ stats }) => {
  const { darkMode } = useTheme();
  const styles = getStyles(darkMode);

  // Format numbers with spaces between thousands
  const formatNumberWithSpaces = (num) => {
    if (!num && num !== 0) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).split(',')[0]; // Just get the date part without time
  };

  return (
    <div style={styles.statsRow} className="stats-row">
      <div style={styles.statCard} className="stat-card">
        <div style={styles.statIcon}>
          <Trophy size={24} color={darkMode ? styles.statValue.color : styles.statValue.color} />
        </div>
        <div style={styles.statValue}>{formatNumberWithSpaces(stats.total_wallets)}</div>
        <div style={styles.statLabel}>Unique Wallets</div>
      </div>
      
      <div style={styles.statCard} className="stat-card">
        <div style={styles.statIcon}>
          <DollarSign size={24} color={darkMode ? styles.statValue.color : styles.statValue.color} />
        </div>
        <div style={styles.statValue}>{formatNumberWithSpaces(stats.total_interactions)}</div>
        <div style={styles.statLabel}>Total Interactions</div>
      </div>
      
      <div style={styles.statCard} className="stat-card">
        <div style={styles.statIcon}>
          <Clock size={24} color={darkMode ? styles.statValue.color : styles.statValue.color} />
        </div>
        <div style={styles.statValue}>{formatDate(stats.last_update)}</div>
        <div style={styles.statLabel}>Last Update</div>
      </div>
    </div>
  );
};

export default StatsPanel; 