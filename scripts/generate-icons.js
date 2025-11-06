/**
 * Script to generate app icons and metadata images
 * Uses canvas to render the container visualization
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Container dimensions and styling - transparent dashed style
const CONTAINER_WIDTH = 100;
const CONTAINER_HEIGHT = 60;
const CONTAINER_DEPTH = 80;
const LINE_COLOR = '#ffffff'; // white lines
const FILL_COLOR = 'rgba(0, 0, 0, 0.3)'; // semi-transparent black

function drawIsometricBox(ctx, x, y, width, height, depth) {
  // Convert to isometric coordinates (45-degree angle)
  const isoX = (x - y) * Math.cos(Math.PI / 6);
  const isoY = (x + y) * Math.sin(Math.PI / 6) - depth;

  // Calculate all vertices
  const vertices = {
    topFrontLeft: [isoX, isoY],
    topFrontRight: [isoX + width * Math.cos(Math.PI / 6), isoY - width * Math.sin(Math.PI / 6)],
    topBackRight: [isoX + (width - height) * Math.cos(Math.PI / 6), isoY - (width + height) * Math.sin(Math.PI / 6)],
    topBackLeft: [isoX - height * Math.cos(Math.PI / 6), isoY - height * Math.sin(Math.PI / 6)],
    bottomFrontLeft: [isoX, isoY + depth],
    bottomFrontRight: [isoX + width * Math.cos(Math.PI / 6), isoY + depth - width * Math.sin(Math.PI / 6)],
    bottomBackRight: [isoX + (width - height) * Math.cos(Math.PI / 6), isoY + depth - (width + height) * Math.sin(Math.PI / 6)],
    bottomBackLeft: [isoX - height * Math.cos(Math.PI / 6), isoY + depth - height * Math.sin(Math.PI / 6)],
  };

  // Fill faces with semi-transparent black
  ctx.globalAlpha = 0.3;

  // Top face
  ctx.fillStyle = FILL_COLOR;
  ctx.beginPath();
  ctx.moveTo(...vertices.topFrontLeft);
  ctx.lineTo(...vertices.topFrontRight);
  ctx.lineTo(...vertices.topBackRight);
  ctx.lineTo(...vertices.topBackLeft);
  ctx.closePath();
  ctx.fill();

  // Left face
  ctx.beginPath();
  ctx.moveTo(...vertices.topFrontLeft);
  ctx.lineTo(...vertices.topBackLeft);
  ctx.lineTo(...vertices.bottomBackLeft);
  ctx.lineTo(...vertices.bottomFrontLeft);
  ctx.closePath();
  ctx.fill();

  // Right face
  ctx.beginPath();
  ctx.moveTo(...vertices.topFrontLeft);
  ctx.lineTo(...vertices.topFrontRight);
  ctx.lineTo(...vertices.bottomFrontRight);
  ctx.lineTo(...vertices.bottomFrontLeft);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 1.0;

  // Draw dashed white edges
  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 3]); // Dashed line pattern

  // Top edges
  ctx.beginPath();
  ctx.moveTo(...vertices.topFrontLeft);
  ctx.lineTo(...vertices.topFrontRight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(...vertices.topFrontRight);
  ctx.lineTo(...vertices.topBackRight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(...vertices.topBackRight);
  ctx.lineTo(...vertices.topBackLeft);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(...vertices.topBackLeft);
  ctx.lineTo(...vertices.topFrontLeft);
  ctx.stroke();

  // Bottom edges
  ctx.beginPath();
  ctx.moveTo(...vertices.bottomFrontLeft);
  ctx.lineTo(...vertices.bottomFrontRight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(...vertices.bottomFrontRight);
  ctx.lineTo(...vertices.bottomBackRight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(...vertices.bottomBackRight);
  ctx.lineTo(...vertices.bottomBackLeft);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(...vertices.bottomBackLeft);
  ctx.lineTo(...vertices.bottomFrontLeft);
  ctx.stroke();

  // Vertical edges
  ctx.beginPath();
  ctx.moveTo(...vertices.topFrontLeft);
  ctx.lineTo(...vertices.bottomFrontLeft);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(...vertices.topFrontRight);
  ctx.lineTo(...vertices.bottomFrontRight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(...vertices.topBackRight);
  ctx.lineTo(...vertices.bottomBackRight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(...vertices.topBackLeft);
  ctx.lineTo(...vertices.bottomBackLeft);
  ctx.stroke();

  ctx.setLineDash([]); // Reset to solid line
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

  // Calculate container position to center it and fit within bounds
  const scale = size / 250; // Scale based on size, smaller to fit better
  const containerWidth = CONTAINER_WIDTH * scale;
  const containerHeight = CONTAINER_HEIGHT * scale;
  const containerDepth = CONTAINER_DEPTH * scale;

  // Center the container vertically - calculate the actual height of the isometric box
  const isoHeight = containerDepth + (containerHeight + containerWidth) * Math.sin(Math.PI / 6);
  const centerX = size / 2;
  const centerY = size / 2 + isoHeight / 2; // True vertical center

  // Draw the container
  ctx.save();
  ctx.translate(centerX, centerY);
  drawIsometricBox(ctx, 0, 0, containerWidth, containerHeight, containerDepth);
  ctx.restore();

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

  // Center the container in the upper portion (leave room for text at bottom)
  const isoHeight = containerDepth + (containerHeight + containerWidth) * Math.sin(Math.PI / 6);
  const centerX = width / 2;
  const centerY = height / 3 + isoHeight / 2; // Upper third, centered

  // Draw the container
  ctx.save();
  ctx.translate(centerX, centerY);
  drawIsometricBox(ctx, 0, 0, containerWidth, containerHeight, containerDepth);
  ctx.restore();

  // Add title text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.floor(height / 15)}px "Fira Code", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('Docker Desktop Reimagined', centerX, height - height / 8);

  // Add subtitle
  ctx.font = `${Math.floor(height / 25)}px "Fira Code", monospace`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('3D-First UI/UX', centerX, height - height / 16);

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
