# Yums.fun - Memecoin Launchpad

Yums.fun is a modern memecoin launchpad built on Solana, allowing users to easily create and trade tokens with minimal effort. The platform features a sleek, user-friendly interface with a distinctive yellow branding.

![Yums.fun Screenshot](https://placeholder.com/yums-screenshot.png)

## Features

- **Token Creation**: Create your own memecoin in minutes with a simple multi-step form
- **Token Discovery**: Browse trending tokens and filter by categories
- **Trading Interface**: Buy and sell tokens directly on the platform
- **Watchlist**: Keep track of your favorite tokens
- **Wallet Integration**: Seamless connection with popular Solana wallets

## Tech Stack

- **Frontend**: React, Next.js, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Solana web3.js
- **Wallet Integration**: Solana Wallet Adapter

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/yums-fun.git
   cd yums-fun
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
yums-fun/
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # Reusable UI components
│   ├── providers/     # Context providers
│   ├── styles/        # Global styles
│   └── utils/         # Utility functions
├── tailwind.config.js # Tailwind CSS configuration
└── next.config.js     # Next.js configuration
```

## Key Components

- **TokenCard**: Displays individual token information in listings
- **PriceChart**: Visualizes token price movements
- **TokenCreationForm**: Multi-step form for creating new tokens
- **Header**: Navigation and wallet connection
- **TrendingTokens**: Displays trending tokens with filtering options

## Deployment

The application can be deployed to Vercel with a single click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fyums-fun)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Inspired by [pump.fun](https://pump.fun)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Solana integration with [web3.js](https://solana-labs.github.io/solana-web3.js/)
