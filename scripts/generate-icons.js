/**
 * Script to generate app icons and metadata images
 * Uses canvas to render the container visualization
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Container dimensions and styling from Container3D.tsx
const CONTAINER_COLOR = '#10b981'; // green-500 for "ready" state
const CONTAINER_WIDTH = 120;
const CONTAINER_HEIGHT = 80;
const CONTAINER_DEPTH = 100;

function drawIsometricBox(ctx, x, y, width, height, depth, color) {
  // Convert to isometric coordinates (45-degree angle)
  const isoX = (x - y) * Math.cos(Math.PI / 6);
  const isoY = (x + y) * Math.sin(Math.PI / 6) - depth;

  // Top face
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(isoX, isoY);
  ctx.lineTo(isoX + width * Math.cos(Math.PI / 6), isoY - width * Math.sin(Math.PI / 6));
  ctx.lineTo(isoX + (width - height) * Math.cos(Math.PI / 6), isoY - (width + height) * Math.sin(Math.PI / 6));
  ctx.lineTo(isoX - height * Math.cos(Math.PI / 6), isoY - height * Math.sin(Math.PI / 6));
  ctx.closePath();
  ctx.fill();

  // Left face (darker)
  ctx.fillStyle = adjustBrightness(color, -30);
  ctx.beginPath();
  ctx.moveTo(isoX, isoY);
  ctx.lineTo(isoX - height * Math.cos(Math.PI / 6), isoY - height * Math.sin(Math.PI / 6));
  ctx.lineTo(isoX - height * Math.cos(Math.PI / 6), isoY + depth - height * Math.sin(Math.PI / 6));
  ctx.lineTo(isoX, isoY + depth);
  ctx.closePath();
  ctx.fill();

  // Right face (lighter)
  ctx.fillStyle = adjustBrightness(color, -15);
  ctx.beginPath();
  ctx.moveTo(isoX, isoY);
  ctx.lineTo(isoX + width * Math.cos(Math.PI / 6), isoY - width * Math.sin(Math.PI / 6));
  ctx.lineTo(isoX + width * Math.cos(Math.PI / 6), isoY + depth - width * Math.sin(Math.PI / 6));
  ctx.lineTo(isoX, isoY + depth);
  ctx.closePath();
  ctx.fill();
}

function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + percent));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + percent));
  const b = Math.max(0, Math.min(255, (num & 0xff) + percent));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

async function generateIcon(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  // Calculate container position to center it
  const scale = size / 300; // Scale based on size
  const containerWidth = CONTAINER_WIDTH * scale;
  const containerHeight = CONTAINER_HEIGHT * scale;
  const containerDepth = CONTAINER_DEPTH * scale;

  // Center the container
  const centerX = size / 2;
  const centerY = size / 2;

  // Draw the container
  ctx.save();
  ctx.translate(centerX, centerY);
  drawIsometricBox(ctx, 0, 0, containerWidth, containerHeight, containerDepth, CONTAINER_COLOR);
  ctx.restore();

  // Add subtle glow effect
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2);
  gradient.addColorStop(0, 'rgba(16, 185, 129, 0.1)');
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Generated ${path.basename(outputPath)} (${size}x${size})`);
}

async function generateMetadataImage(width, height, outputPath) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Calculate container position to center it
  const scale = Math.min(width, height) / 300;
  const containerWidth = CONTAINER_WIDTH * scale;
  const containerHeight = CONTAINER_HEIGHT * scale;
  const containerDepth = CONTAINER_DEPTH * scale;

  // Center the container
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw the container
  ctx.save();
  ctx.translate(centerX, centerY);
  drawIsometricBox(ctx, 0, 0, containerWidth, containerHeight, containerDepth, CONTAINER_COLOR);
  ctx.restore();

  // Add title text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.floor(height / 15)}px "Fira Code", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('Docker Desktop Reimagined', centerX, height - height / 8);

  // Add subtitle
  ctx.font = `${Math.floor(height / 25)}px "Fira Code", monospace`;
  ctx.fillStyle = '#10b981';
  ctx.fillText('3D-First UI/UX', centerX, height - height / 16);

  // Add subtle glow effect
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 2);
  gradient.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Generated ${path.basename(outputPath)} (${width}x${height})`);
}

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');

  console.log('Generating icons and metadata images...\n');

  // Generate PWA icons at various sizes
  await generateIcon(192, path.join(publicDir, 'icon-192.png'));
  await generateIcon(512, path.join(publicDir, 'icon-512.png'));
  await generateIcon(180, path.join(publicDir, 'apple-touch-icon.png')); // iOS
  await generateIcon(32, path.join(publicDir, 'favicon-32x32.png'));
  await generateIcon(16, path.join(publicDir, 'favicon-16x16.png'));

  console.log('');

  // Generate metadata images for social sharing
  await generateMetadataImage(1200, 630, path.join(publicDir, 'og-image.png')); // OpenGraph
  await generateMetadataImage(1200, 600, path.join(publicDir, 'twitter-image.png')); // Twitter

  console.log('\n✓ All images generated successfully!');
}

main().catch(console.error);
