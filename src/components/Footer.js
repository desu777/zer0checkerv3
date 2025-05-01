import React from 'react';
import { useTheme } from '../ThemeContext';
import { getStyles } from '../styles/leaderboardStyles';

const Footer = () => {
  const { darkMode } = useTheme();
  const styles = getStyles(darkMode);

  return (
    <>
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span>zer0 Checker © 2025 | p0wered by desu</span>
            <img src="/nft.png" alt="NFT" style={{height: '40px', borderRadius: '50%'}} />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <span>Data provided by</span>
            <img src="/logo.png" alt="0G Logo" style={{height: '30px'}} />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer; 