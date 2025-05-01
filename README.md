# Zer0 Leaderboard

A modern, interactive leaderboard application for tracking and displaying user interactions with the Zer0 protocol. This application provides real-time insights into user engagement and protocol usage through an intuitive and responsive interface.

## Features

- 📊 Real-time leaderboard displaying wallet rankings based on interaction counts
- 🔍 Advanced wallet search functionality
- 📈 Detailed statistics and analytics
- 🎨 Dark/Light mode support
- 📱 Fully responsive design
- ⚡ Real-time updates
- 🔄 Interactive data filtering and sorting
- 📊 Comprehensive wallet statistics including:
  - Total interactions
  - Swap interactions
  - Pool interactions
  - Gas usage
  - First and last interaction dates

## Tech Stack

- React 18
- Axios for API communication
- Lucide React for modern icons
- CSS Modules for styling
- Environment-based configuration

## Installation

1. Clone the repository:
```bash
git clone https://github.com/desu777/zer0checkerv3.git
cd zer0-leaderboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and configure environment variables:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_LEADERBOARD_API_URL=http://localhost:3004
```

4. Start the application:
```bash
npm start
```

## Configuration

The application requires the following environment variables:

- `REACT_APP_API_URL` - Main API endpoint URL
- `REACT_APP_LEADERBOARD_API_URL` - Leaderboard API endpoint URL
- `REACT_APP_WALLET_CONNECT_PROJECT_ID` - WalletConnect project ID (optional)

## Security Features

- CORS implementation with strict origin policies
- Input validation and sanitization
- XSS protection
- Secure API communication
- Environment variable protection
- Rate limiting support

## Development

The application is built with modern React practices and follows a component-based architecture. Key components include:

- `LeaderboardComponent` - Main leaderboard display
- `WalletLookup` - Wallet search functionality
- `StatsPanel` - Statistics display
- `TimeRangeFilter` - Time-based filtering
- `BackgroundBubbles` - Interactive background effects

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 