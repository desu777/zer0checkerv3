/**
 * Konfiguracja URL-i do różnych usług API
 */

// Główne API URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Leaderboard API URL
export const LEADERBOARD_URL = process.env.REACT_APP_LEADERBOARD_API_URL || 'http://localhost:3004';

// Wallet Connect Project ID
export const WALLET_CONNECT_PROJECT_ID = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || '';

