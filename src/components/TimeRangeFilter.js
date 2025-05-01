import React from 'react';
import { Clock, Link } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { getStyles } from '../styles/leaderboardStyles';

const TimeRangeFilter = ({ formatDate, stats }) => {
  const { darkMode } = useTheme();
  const styles = getStyles(darkMode);

  return (
    <>
      <div style={styles.leaderboardFilters}>
        <div style={styles.lastUpdated}>
          <Clock size={14} />
          Last updated: {formatDate(stats.last_update)}
        </div>
      </div>
      
      <div style={{...styles.lastUpdated, marginBottom: '20px'}}>
        <Link size={14} />
        Data syncing since swap&pool contracts were created.
      </div>
    </>
  );
};

export default TimeRangeFilter; 