#!/bin/bash

# Docker Helper Script for MUI Sandbox
# Provides convenient commands for Docker operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running!"
        print_info "Please start Docker Desktop and try again."
        exit 1
    fi
}

# Function to show usage
show_usage() {
    cat << EOF
${GREEN}Docker Helper for MUI Sandbox${NC}

${BLUE}Usage:${NC}
  ./docker-helper.sh [command]

${BLUE}Commands:${NC}
  ${GREEN}start${NC}         Start the development environment
  ${GREEN}start-bg${NC}      Start in background (detached mode)
  ${GREEN}stop${NC}          Stop the development environment
  ${GREEN}restart${NC}       Restart the development environment
  ${GREEN}logs${NC}          View container logs
  ${GREEN}build${NC}         Build the Docker image
  ${GREEN}rebuild${NC}       Rebuild and start (force rebuild)
  ${GREEN}clean${NC}         Stop and remove containers, networks, volumes
  ${GREEN}shell${NC}         Open shell in running container
  ${GREEN}prod${NC}          Start production build (port 8080)
  ${GREEN}status${NC}        Show running containers
  ${GREEN}help${NC}          Show this help message

${BLUE}Examples:${NC}
  ${YELLOW}./docker-helper.sh start${NC}      # Start Storybook at localhost:6006
  ${YELLOW}./docker-helper.sh logs${NC}       # Watch logs in real-time
  ${YELLOW}./docker-helper.sh rebuild${NC}    # Rebuild and start after dependency changes

EOF
}

# Main script logic
case "${1}" in
    start)
        check_docker
        print_info "Starting MUI Storybook in development mode..."
        docker-compose up
        ;;

    start-bg)
        check_docker
        print_info "Starting MUI Storybook in background..."
        docker-compose up -d
        print_success "Container started! Storybook available at http://localhost:6006"
        print_info "View logs with: ./docker-helper.sh logs"
        ;;

    stop)
        check_docker
        print_info "Stopping MUI Storybook..."
        docker-compose down
        print_success "Container stopped"
        ;;

    restart)
        check_docker
        print_info "Restarting MUI Storybook..."
        docker-compose restart
        print_success "Container restarted"
        ;;

    logs)
        check_docker
        print_info "Showing logs (Ctrl+C to exit)..."
        docker-compose logs -f mui-storybook
        ;;

    build)
        check_docker
        print_info "Building Docker image..."
        docker-compose build
        print_success "Image built successfully"
        ;;

    rebuild)
        check_docker
        print_info "Rebuilding and starting..."
        docker-compose up --build
        ;;

    clean)
        check_docker
        print_warning "This will remove containers, networks, and volumes!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Cleaning up..."
            docker-compose down -v
            print_success "Cleanup complete"
        else
            print_info "Cleanup cancelled"
        fi
        ;;

    shell)
        check_docker
        print_info "Opening shell in container..."
        docker-compose exec mui-storybook sh
        ;;

    prod)
        check_docker
        print_info "Starting production build (this may take a few minutes)..."
        docker-compose --profile production up mui-storybook-prod
        print_success "Production build available at http://localhost:8080"
        ;;

    status)
        check_docker
        print_info "Running containers:"
        docker-compose ps
        ;;

    help|--help|-h)
        show_usage
        ;;

    *)
        print_error "Unknown command: ${1}"
        echo ""
        show_usage
        exit 1
        ;;
esac
