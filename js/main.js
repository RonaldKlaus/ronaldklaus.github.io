/**
 * Main JavaScript for Ronald Klaus personal page
 * Handles accent color randomization and imports other modules
 */

// Random Accent Color Generator
const colors = [
    '#FF3300', // International Orange
    '#0047AB', // Cobalt Blue
    '#00D800', // Terminal Green
    '#ffaa00', // Signal Yellow
    '#FF00FF', // Magenta
    '#5500FF'  // Electric Violet
];

function setRandomAccentColor() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.documentElement.style.setProperty('--accent', randomColor);
    console.log('Accent Color:', randomColor);
}

// Set accent color immediately
setRandomAccentColor();

// Import and initialize i18n
import './i18n.js';
