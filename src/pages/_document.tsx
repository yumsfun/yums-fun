import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#FFD100" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="description" content="The easiest way to create, launch and trade memecoins on Solana with no code required" />
        <meta name="keywords" content="solana, memecoin, token, crypto, blockchain, defi" />
        <meta property="og:title" content="Yummy.fun - Launch your Solana token in seconds" />
        <meta property="og:description" content="The easiest way to create, launch and trade memecoins on Solana with no code required" />
        <meta property="og:image" content="https://yummy.fun/og-image.png" />
        <meta property="og:url" content="https://yummy.fun" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Yummy.fun - Launch your Solana token in seconds" />
        <meta name="twitter:description" content="The easiest way to create, launch and trade memecoins on Solana with no code required" />
        <meta name="twitter:image" content="https://yummy.fun/og-image.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 