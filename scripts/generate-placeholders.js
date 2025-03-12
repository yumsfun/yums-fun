// This script generates placeholder JPG images for tokens
const fs = require('fs');
const path = require('path');
const https = require('https');

const tokensDir = path.join(__dirname, '../public/tokens');

// Ensure tokens directory exists
if (!fs.existsSync(tokensDir)) {
  fs.mkdirSync(tokensDir, { recursive: true });
}

// List of token names and placeholder images
const tokens = [
  { name: 'kity', url: 'https://picsum.photos/200/200?random=1' },
  { name: 'moondoge', url: 'https://picsum.photos/200/200?random=2' },
  { name: 'panda', url: 'https://picsum.photos/200/200?random=3' },
  { name: 'frog', url: 'https://picsum.photos/200/200?random=4' },
  { name: 'solalien', url: 'https://picsum.photos/200/200?random=5' }
];

// Download each image
tokens.forEach(token => {
  const filePath = path.join(tokensDir, `${token.name}.jpg`);
  const file = fs.createWriteStream(filePath);
  
  https.get(token.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${token.name}.jpg`);
    });
  }).on('error', err => {
    fs.unlink(filePath);
    console.error(`Error downloading ${token.name}.jpg: ${err.message}`);
  });
});

console.log('Started downloading placeholder images...'); 