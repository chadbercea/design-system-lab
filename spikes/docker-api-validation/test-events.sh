#!/bin/bash

# Test script to generate Docker events for demonstration
# Run this in a separate terminal while events-listener.js is running

echo "🚀 Generating Docker events for testing..."
echo ""

echo "1. Creating and starting a container..."
docker run --name test-container-1 --rm -d alpine sleep 10
sleep 2

echo "2. Creating another container..."
docker run --name test-container-2 --rm -d alpine sleep 10
sleep 2

echo "3. Pulling an image..."
docker pull alpine:latest
sleep 2

echo "4. Creating a network..."
docker network create test-network
sleep 2

echo "5. Creating a volume..."
docker volume create test-volume
sleep 2

echo "6. Stopping containers (they will auto-remove due to --rm flag)..."
docker stop test-container-1 test-container-2
sleep 2

echo "7. Cleaning up network..."
docker network rm test-network
sleep 1

echo "8. Cleaning up volume..."
docker volume rm test-volume
sleep 1

echo ""
echo "✅ Test complete! Check the events listener output."
