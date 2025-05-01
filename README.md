# Zer0 Leaderboard

Aplikacja do wyświetlania rankingu interakcji użytkowników z protokołem Zer0.

## Funkcjonalności

- Wyświetlanie rankingu portfeli według liczby interakcji
- Filtrowanie i sortowanie danych
- Wyszukiwanie konkretnych portfeli
- Statystyki ogólne
- Responsywny interfejs

## Technologie

- React
- Axios
- Lucide React (ikony)
- CSS Modules

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/desu777/zer0checkerv3.git
cd zer0-leaderboard
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Utwórz plik .env i skonfiguruj zmienne środowiskowe:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_LEADERBOARD_API_URL=http://localhost:3004
```

4. Uruchom aplikację:
```bash
npm start
```

## Konfiguracja

Aplikacja wymaga skonfigurowania następujących zmiennych środowiskowych:

- `REACT_APP_API_URL` - URL głównego API
- `REACT_APP_LEADERBOARD_API_URL` - URL API leaderboard
- `REACT_APP_WALLET_CONNECT_PROJECT_ID` - ID projektu WalletConnect (opcjonalne)

## Bezpieczeństwo

- Implementacja CORS zgodnie z dokumentacją
- Walidacja danych wejściowych
- Sanityzacja danych wyjściowych
- Ochrona przed XSS

## Licencja

MIT 