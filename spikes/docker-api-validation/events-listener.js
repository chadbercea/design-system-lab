#!/usr/bin/env node

/**
 * Docker Events Listener
 * Demonstrates real-time monitoring of Docker container lifecycle events
 * Part of spike for ILI-93
 */

import Docker from 'dockerode';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// Track event statistics
const stats = {
  container: { create: 0, start: 0, stop: 0, destroy: 0, die: 0, kill: 0, pause: 0, unpause: 0 },
  image: { pull: 0, push: 0, delete: 0, tag: 0, untag: 0 },
  network: { create: 0, connect: 0, disconnect: 0, destroy: 0 },
  volume: { create: 0, mount: 0, unmount: 0, destroy: 0 }
};

// Format timestamp
function formatTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString();
}

// Get emoji for event type
function getEmoji(type, action) {
  const emojiMap = {
    container: {
      create: '🏗️ ',
      start: '▶️ ',
      stop: '⏹️ ',
      die: '💀',
      kill: '🔪',
      destroy: '💥',
      pause: '⏸️ ',
      unpause: '▶️ '
    },
    image: {
      pull: '⬇️ ',
      push: '⬆️ ',
      delete: '🗑️ ',
      tag: '🏷️ ',
      untag: '🏷️ '
    },
    network: {
      create: '🌐',
      connect: '🔌',
      disconnect: '🔌',
      destroy: '💥'
    },
    volume: {
      create: '💾',
      mount: '📁',
      unmount: '📁',
      destroy: '🗑️ '
    }
  };
  return emojiMap[type]?.[action] || '📌';
}

// Format event for display
function displayEvent(event) {
  const { Type, Action, time, Actor } = event;
  const emoji = getEmoji(Type, Action);
  const timestamp = formatTime(time);

  // Update statistics
  if (stats[Type] && stats[Type][Action] !== undefined) {
    stats[Type][Action]++;
  }

  console.log(`${emoji} [${timestamp}] ${Type.toUpperCase()}: ${Action}`);

  // Display relevant attributes
  if (Actor?.Attributes) {
    const attrs = Actor.Attributes;
    if (attrs.name) console.log(`   Name: ${attrs.name}`);
    if (attrs.image) console.log(`   Image: ${attrs.image}`);
    if (Type === 'container' && event.id) {
      console.log(`   Container ID: ${event.id.substring(0, 12)}`);
    }
  }

  console.log(); // Empty line for readability
}

// Display statistics summary
function displayStats() {
  console.log('\n📊 Event Statistics:');
  console.log('━'.repeat(50));

  Object.entries(stats).forEach(([type, actions]) => {
    const total = Object.values(actions).reduce((sum, count) => sum + count, 0);
    if (total > 0) {
      console.log(`\n${type.toUpperCase()}: ${total} events`);
      Object.entries(actions).forEach(([action, count]) => {
        if (count > 0) {
          console.log(`  ${action}: ${count}`);
        }
      });
    }
  });
  console.log('\n' + '━'.repeat(50));
}

async function startEventListener() {
  console.log('🎧 Docker Event Listener Starting...\n');
  console.log('Monitoring all Docker events in real-time');
  console.log('Press Ctrl+C to stop and see statistics\n');
  console.log('━'.repeat(50));
  console.log();

  try {
    // Verify connection first
    await docker.ping();

    // Start listening to events
    const stream = await docker.getEvents({
      filters: {
        type: ['container', 'image', 'network', 'volume']
      }
    });

    // Process events as they arrive
    stream.on('data', (chunk) => {
      try {
        const event = JSON.parse(chunk.toString());
        displayEvent(event);
      } catch (error) {
        console.error('Error parsing event:', error.message);
      }
    });

    stream.on('error', (error) => {
      console.error('❌ Stream error:', error.message);
    });

    stream.on('end', () => {
      console.log('\n📡 Event stream ended');
      displayStats();
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Stopping event listener...');
      displayStats();
      stream.destroy();
      process.exit(0);
    });

    // Keep the process alive
    await new Promise(() => {});

  } catch (error) {
    console.error('❌ Failed to start event listener:', error.message);
    console.error('\n📋 Troubleshooting:');
    console.error('   1. Is Docker Desktop running?');
    console.error('   2. Do you have permission to access /var/run/docker.sock?');
    console.error('   3. Try: sudo chmod 666 /var/run/docker.sock (if needed)\n');
    process.exit(1);
  }
}

// Display usage instructions
console.log(`
╔═══════════════════════════════════════════════════╗
║     Docker Container Events Listener (ILI-93)    ║
╚═══════════════════════════════════════════════════╝

This script monitors real-time Docker events.

To test it:
1. Keep this running in one terminal
2. In another terminal, run some Docker commands:
   - docker run --rm alpine echo "Hello"
   - docker pull nginx
   - docker stop <container>

The events will appear here in real-time!
`);

startEventListener();
