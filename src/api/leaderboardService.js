import axios from 'axios';

// Pobierz URL z zmiennych środowiskowych lub użyj domyślnego, tak jak w oryginalnej aplikacji
const LEADERBOARD_URL = process.env.REACT_APP_LEADERBOARD_API_URL || 'http://localhost:3004';

/**
 * Serwis do komunikacji z API leaderboard
 */
const leaderboardService = {
  /**
   * Pobiera dane leaderboard
   * @param {number} limit - Maksymalna liczba portfeli do pobrania
   * @returns {Promise<Object>} - Dane leaderboard
   */
  getLeaderboard: async (limit = 100) => {
    try {
      console.log(`Fetching leaderboard data from ${LEADERBOARD_URL}/api/leaderboard with limit ${limit}`);
      const response = await axios.get(`${LEADERBOARD_URL}/api/leaderboard`, {
        params: { limit }
      });
      
      if (!response.data || !response.data.wallets || !Array.isArray(response.data.wallets)) {
        console.error('Invalid API response format:', response.data);
        throw new Error('Nieprawidłowa odpowiedź API: brak danych wallets lub niewłaściwy format');
      }
      
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania danych leaderboard:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      }
      throw error;
    }
  },
  
  /**
   * Pobiera dane konkretnego portfela
   * @param {string} address - Adres portfela
   * @returns {Promise<Object>} - Dane portfela
   */
  getWalletDetails: async (address) => {
    try {
      console.log(`Fetching wallet details for ${address}`);
      const response = await axios.get(`${LEADERBOARD_URL}/api/leaderboard/wallet/${address}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas pobierania danych portfela ${address}:`, error);
      if (error.response && error.response.status === 404) {
        return null; // Wallet not found
      }
      throw error;
    }
  },
  
  /**
   * Pobiera status aktualizacji leaderboard
   * @returns {Promise<Object>} - Status aktualizacji
   */
  getUpdateStatus: async () => {
    try {
      const response = await axios.get(`${LEADERBOARD_URL}/api/leaderboard/status`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania statusu aktualizacji:', error);
      throw error;
    }
  },
  
  /**
   * Sprawdza czy serwis leaderboard jest dostępny
   * @returns {Promise<boolean>} - True jeśli serwis jest dostępny
   */
  checkHealth: async () => {
    try {
      const response = await axios.get(`${LEADERBOARD_URL}/api/health`);
      return response.data.status === 'ok';
    } catch (error) {
      console.error('Błąd podczas sprawdzania statusu serwisu leaderboard:', error);
      return false;
    }
  },

  /**
   * Sprawdza pozycję (rank) portfela w leaderboardzie
   * @param {string} address - Adres portfela
   * @returns {Promise<Object>} - Dane pozycji portfela
   */
  getWalletRank: async (address) => {
    if (!address) {
      console.warn('No wallet address provided to getWalletRank');
      return { exists: false, rank: null, stats: null };
    }
    
    try {
      console.log(`Getting wallet rank for ${address}`);
      // Pobieramy wszystkie portfele
      const response = await axios.get(`${LEADERBOARD_URL}/api/leaderboard`, {
        params: { limit: 10000 } // duży limit, aby objąć cały ranking
      });
      
      if (!response.data || !response.data.wallets) {
        throw new Error('Nieprawidłowa odpowiedź API');
      }
      
      // Szukamy pozycji portfela
      const wallets = response.data.wallets;
      const walletIndex = wallets.findIndex(
        wallet => wallet.address && wallet.address.toLowerCase() === address.toLowerCase()
      );
      
      if (walletIndex === -1) {
        console.log(`Wallet ${address} not found in general leaderboard data, trying direct API call...`);
        
        try {
          // Fallback: Try fetching the wallet directly from the API endpoint
          const walletData = await leaderboardService.getWalletDetails(address);
          
          if (walletData) {
            console.log(`Direct API call successful for wallet ${address}`);
            
            // Convert the direct API response into the expected format
            return {
              exists: true,
              rank: walletData.rank || 0, // Use the rank from API or default to 0
              stats: {
                address: walletData.address,
                total_interactions: walletData.total_interactions || 0,
                swap_interactions: walletData.swap_interactions || 0,
                pool_interactions: walletData.pool_interactions || 0,
                approve_interactions: walletData.approve_interactions || 0,
                total_gas_used: walletData.total_gas_used || '0',
                first_interaction_date: walletData.first_interaction_date,
                last_interaction_date: walletData.last_interaction_date,
                update_time: walletData.update_time || walletData.last_interaction_date
              },
              totalWallets: wallets.length
            };
          }
        } catch (directApiError) {
          console.error(`Failed to fetch wallet data directly: ${directApiError}`);
        }
        
        return { exists: false, rank: null, stats: null };
      }
      
      // Zwracamy pozycję i dane statystyczne
      return {
        exists: true,
        rank: walletIndex + 1,
        stats: wallets[walletIndex],
        totalWallets: wallets.length
      };
    } catch (error) {
      console.error(`Błąd podczas pobierania pozycji portfela ${address}:`, error);
      throw error;
    }
  }
};

export default leaderboardService; 