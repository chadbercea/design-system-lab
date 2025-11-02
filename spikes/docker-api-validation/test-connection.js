#!/usr/bin/env node

/**
 * Docker API Connection Test
 * Tests basic connectivity to the Docker daemon via Unix socket
 * Part of spike for ILI-93
 */

import Docker from 'dockerode';

async function testConnection() {
  console.log('🔍 Testing Docker Engine API Connection...\n');

  try {
    // Connect to Docker via Unix socket (default on Mac/Linux)
    const docker = new Docker({ socketPath: '/var/run/docker.sock' });

    // Test 1: Get Docker version info
    console.log('Test 1: Checking Docker daemon version...');
    const version = await docker.version();
    console.log('✅ Successfully connected to Docker daemon');
    console.log(`   Docker Version: ${version.Version}`);
    console.log(`   API Version: ${version.ApiVersion}`);
    console.log(`   Go Version: ${version.GoVersion}`);
    console.log(`   OS/Arch: ${version.Os}/${version.Arch}\n`);

    // Test 2: List running containers
    console.log('Test 2: Listing running containers...');
    const containers = await docker.listContainers();
    console.log(`✅ Found ${containers.length} running container(s)`);
    containers.forEach(container => {
      console.log(`   - ${container.Names[0]} (${container.Image})`);
      console.log(`     ID: ${container.Id.substring(0, 12)}`);
      console.log(`     Status: ${container.Status}`);
    });
    console.log();

    // Test 3: List all containers (including stopped)
    console.log('Test 3: Listing all containers (including stopped)...');
    const allContainers = await docker.listContainers({ all: true });
    console.log(`✅ Found ${allContainers.length} total container(s)\n`);

    // Test 4: Get system info
    console.log('Test 4: Getting system info...');
    const info = await docker.info();
    console.log('✅ System info retrieved');
    console.log(`   Containers: ${info.Containers}`);
    console.log(`   Running: ${info.ContainersRunning}`);
    console.log(`   Paused: ${info.ContainersPaused}`);
    console.log(`   Stopped: ${info.ContainersStopped}`);
    console.log(`   Images: ${info.Images}\n`);

    console.log('🎉 All connection tests passed!\n');
    console.log('📝 Summary:');
    console.log('   ✓ Can connect to Docker daemon via Unix socket');
    console.log('   ✓ Can retrieve version and system information');
    console.log('   ✓ Can list containers');
    console.log('   ✓ Ready to implement event listening\n');

    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n📋 Troubleshooting:');
    console.error('   1. Is Docker Desktop running?');
    console.error('   2. Do you have permission to access /var/run/docker.sock?');
    console.error('   3. Try: sudo chmod 666 /var/run/docker.sock (if needed)');
    console.error('   4. Or add your user to docker group: sudo usermod -aG docker $USER\n');
    return false;
  }
}

// Run the test
testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
