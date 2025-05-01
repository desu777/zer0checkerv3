// Colors from Mantine system
const colors = {
  light: {
    bg: {
      main: '#FFFFFF',
      secondary: '#FDF7FD',
      panel: '#FAEAFA',
      accent: '#FCF2FC',
      text: '#221B22',
    },
    primary: {
      main: '#FE4E52',
      hover: '#E18528',
      light: 'rgba(254, 78, 82, 0.1)',
    },
    system: {
      main: '#5C4C5C',
      text: '#A591A4',
      secondary: '#C3C3CD',
      accent: '#F8F6F8',
      link: '#748dc1',
      success: '#00B8A1',
      error: '#FE4E52',
      warning: '#E18528',
      info: '#E074DD',
      purple: '#D952D5',
    }
  },
  dark: {
    bg: {
      main: '#050505',
      secondary: '#0F0F0F',
      panel: '#1C171C',
      accent: '#FCF2FC',
      text: '#C3C3CD',
    },
    primary: {
      main: '#00D2E9',
      hover: '#E18528',
      light: 'rgba(0, 210, 233, 0.1)',
    },
    system: {
      main: '#C3C3CD',
      text: '#98999F',
      secondary: '#505158',
      accent: '#F8F6F8',
      link: '#748dc1',
      success: '#00B8A1',
      error: '#FE4E52',
      warning: '#E18528',
      info: '#00D2E9',
      purple: '#D952D5',
    }
  }
};

export const getStyles = (darkMode) => {
  // Select color scheme
  const theme = darkMode ? colors.dark : colors.light;

  // Custom styles
  return {
    appContainer: {
      fontFamily: "'Montserrat', sans-serif",
      minHeight: '100vh',
      backgroundColor: darkMode ? 'transparent' : theme.bg.main,
      background: darkMode ? 'linear-gradient(180deg, #003366 0%, #001220 100%)' : 'none',
      color: darkMode ? theme.bg.text : theme.bg.text,
      transition: 'background-color 0.3s, color 0.3s',
      position: darkMode ? 'relative' : 'static',
      overflow: darkMode ? 'hidden' : 'auto'
    },
    header: {
      padding: '20px',
      backgroundColor: darkMode ? theme.bg.secondary : theme.bg.secondary,
      borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: darkMode ? theme.system.main : theme.bg.text
    },
    badge: {
      fontSize: '12px',
      backgroundColor: darkMode ? 'rgba(0, 210, 233, 0.2)' : 'rgba(224, 116, 221, 0.2)',
      color: darkMode ? theme.primary.main : theme.system.info,
      padding: '2px 8px',
      borderRadius: '4px',
      marginLeft: '10px'
    },
    themeToggle: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: darkMode ? theme.system.main : theme.bg.text,
      padding: '8px',
      borderRadius: '50%',
      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    mainMenu: {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      padding: '12px',
      backgroundColor: darkMode ? theme.bg.secondary : theme.bg.secondary
    },
    menuItem: (active) => ({
      padding: '8px 16px',
      background: active ? 
        (darkMode ? theme.system.info : `linear-gradient(to right, ${theme.system.error}, ${theme.system.purple})`) : 
        'transparent',
      border: 'none',
      color: active ? 'white' : (darkMode ? theme.system.main : theme.bg.text),
      fontWeight: active ? '600' : '500',
      borderRadius: '20px',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }),
    contentContainer: {
      maxWidth: '1200px',
      margin: '24px auto',
      padding: '0 16px',
      position: 'relative',
      zIndex: 1,
      '@media (max-width: 768px)': {
        padding: '0 10px',
        margin: '16px auto'
      }
    },
    panel: {
      backgroundColor: darkMode ? '#000000' : theme.bg.panel,
      padding: '24px',
      marginBottom: '24px',
      boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
      borderRadius: '16px',
      border: darkMode ? '1px solid rgba(0, 230, 230, 0.2)' : 'none',
      '@media (max-width: 768px)': {
        padding: '16px',
        marginBottom: '16px',
        borderRadius: '12px'
      }
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '24px',
      color: darkMode ? theme.system.main : theme.bg.text
    },
    statsRow: {
      display: 'flex', 
      justifyContent: 'space-between',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '16px',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'center'
      }
    },
    statCard: {
      flex: '1 1 30%',
      backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : theme.bg.accent,
      borderRadius: '16px',
      padding: '20px',
      textAlign: 'center',
      minWidth: '200px',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      '@media (max-width: 768px)': {
        width: '100%',
        minWidth: 'auto',
        padding: '16px'
      }
    },
    statIcon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: darkMode ? 'rgba(0, 210, 233, 0.15)' : 'rgba(224, 116, 221, 0.15)'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: darkMode ? theme.primary.main : theme.system.info
    },
    statLabel: {
      fontSize: '14px',
      color: darkMode ? theme.system.text : theme.system.text
    },
    leaderboardFilters: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '0 0 20px 0',
      flexWrap: 'wrap',
      gap: '16px'
    },
    filtersLeft: {
      display: 'flex',
      gap: '12px'
    },
    timeRangeButton: (active) => ({
      background: active ? 
        (darkMode ? theme.system.info : `linear-gradient(to right, ${theme.system.error}, ${theme.system.purple})`) : 
        (darkMode ? 'rgba(28, 23, 28, 0.5)' : theme.bg.accent),
      color: active ? 'white' : (darkMode ? theme.system.main : theme.bg.text),
      border: 'none',
      borderRadius: '20px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: active ? '600' : '400',
      cursor: 'pointer'
    }),
    lastUpdated: {
      fontSize: '14px',
      color: darkMode ? theme.system.text : theme.system.text,
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 8px'
    },
    tableHead: {
      textAlign: 'left'
    },
    tableHeader: {
      padding: '12px 16px',
      color: darkMode ? theme.system.text : theme.system.text,
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      position: 'relative',
      whiteSpace: 'nowrap'
    },
    tableHeaderActive: {
      color: darkMode ? theme.primary.main : theme.system.info
    },
    sortIcon: {
      marginLeft: '4px',
      position: 'relative',
      top: '2px'
    },
    tableRow: (index) => ({
      backgroundColor: darkMode ? 
        (index % 2 === 0 ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)') : 
        (index % 2 === 0 ? theme.bg.accent : 'rgba(252, 242, 252, 0.7)'),
      transition: 'transform 0.2s'
    }),
    tableRowTop: {
      background: darkMode ? 
        'linear-gradient(90deg, rgba(0, 210, 233, 0.15), rgba(217, 82, 213, 0.15))' : 
        'linear-gradient(90deg, rgba(254, 78, 82, 0.15), rgba(217, 82, 213, 0.15))'
    },
    tableCell: {
      padding: '16px',
      color: darkMode ? theme.system.main : theme.bg.text,
      fontSize: '15px',
      borderTop: 'none',
      borderBottom: 'none'
    },
    rankCell: {
      fontWeight: '700',
      width: '80px'
    },
    rankTop: {
      color: darkMode ? theme.system.success : theme.system.info
    },
    addressCell: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    addressLink: {
      color: darkMode ? theme.primary.main : theme.system.info,
      textDecoration: 'none',
      fontWeight: '500'
    },
    valueCell: {
      fontWeight: '600'
    },
    footer: {
      textAlign: 'center',
      padding: '20px',
      fontSize: '14px',
      marginTop: '40px',
      color: darkMode ? theme.system.text : theme.system.text,
      borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
    },
    socialLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      padding: '20px',
      marginTop: '20px'
    },
    socialLink: {
      color: darkMode ? theme.system.text : theme.system.text,
      fontSize: '18px',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    footerContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '15px'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '40px',
      color: darkMode ? theme.system.text : theme.system.text
    },
    loadingBar: {
      width: '100%',
      height: '4px',
      backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      borderRadius: '4px',
      overflow: 'hidden',
      position: 'relative',
      marginTop: '20px',
      marginBottom: '20px'
    },
    loadingBarInner: {
      height: '100%',
      width: '30%',
      backgroundColor: darkMode ? theme.primary.main : theme.system.info,
      borderRadius: '4px',
      position: 'absolute',
      animation: 'loading 1.5s infinite'
    },
    errorContainer: {
      textAlign: 'center',
      padding: '40px',
      color: theme.system.error
    },
    retryButton: {
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: darkMode ? theme.primary.main : theme.system.info,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '500'
    },
    expandButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      background: darkMode ? 
        'linear-gradient(90deg, rgba(0, 210, 233, 0.7), rgba(217, 82, 213, 0.7))' : 
        'linear-gradient(90deg, rgba(254, 78, 82, 0.7), rgba(217, 82, 213, 0.7))',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '500',
      fontSize: '14px'
    }
  };
}; 