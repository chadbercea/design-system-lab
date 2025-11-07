#!/bin/bash

# Docker Helper Script for Next.js App
# Provides convenient commands for Docker operations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

print_highlight() {
    echo -e "${CYAN}→ ${1}${NC}"
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
${GREEN}Docker Helper for Next.js App${NC}

${BLUE}Usage:${NC}
  ./docker-nextjs.sh [command]

${BLUE}Development Commands:${NC}
  ${GREEN}dev${NC}           Start development server with hot-reload
  ${GREEN}dev-bg${NC}        Start development in background (detached mode)
  ${GREEN}logs${NC}          View container logs
  ${GREEN}shell${NC}         Open shell in running container
  ${GREEN}stop${NC}          Stop the development environment
  ${GREEN}restart${NC}       Restart the development environment

${BLUE}Production Commands:${NC}
  ${GREEN}build${NC}         Build the Docker image (development)
  ${GREEN}build-prod${NC}    Build production Docker image
  ${GREEN}prod${NC}          Start production build (port 8080)
  ${GREEN}prod-bg${NC}       Start production in background

${BLUE}Maintenance Commands:${NC}
  ${GREEN}clean${NC}         Stop and remove containers, networks, volumes
  ${GREEN}rebuild${NC}       Rebuild and start development (force rebuild)
  ${GREEN}status${NC}        Show running containers
  ${GREEN}health${NC}        Check container health status
  ${GREEN}help${NC}          Show this help message

${BLUE}Examples:${NC}
  ${YELLOW}./docker-nextjs.sh dev${NC}        # Start dev server at localhost:3000
  ${YELLOW}./docker-nextjs.sh prod${NC}       # Test production build at localhost:8080
  ${YELLOW}./docker-nextjs.sh logs${NC}       # Watch logs in real-time
  ${YELLOW}./docker-nextjs.sh rebuild${NC}    # Rebuild after dependency changes

${BLUE}Notes:${NC}
  - Development mode includes hot-reload for src/ and config files
  - Production mode serves the static export via nginx
  - Both modes respect the GitHub Pages basePath configuration
  - Use ${CYAN}dev${NC} for local development, ${CYAN}prod${NC} to test deployment

EOF
}

# Compose file flag
COMPOSE_FILE="docker-compose.nextjs.yml"

# Main script logic
case "${1}" in
    dev)
        check_docker
        print_info "Starting Next.js development server with hot-reload..."
        print_highlight "Access at: http://localhost:3000"
        docker-compose -f $COMPOSE_FILE up nextjs-dev
        ;;

    dev-bg)
        check_docker
        print_info "Starting Next.js development server in background..."
        docker-compose -f $COMPOSE_FILE up -d nextjs-dev
        print_success "Container started!"
        print_highlight "Access at: http://localhost:3000"
        print_info "View logs with: ./docker-nextjs.sh logs"
        ;;

    stop)
        check_docker
        print_info "Stopping Next.js containers..."
        docker-compose -f $COMPOSE_FILE down
        print_success "Containers stopped"
        ;;

    restart)
        check_docker
        print_info "Restarting Next.js containers..."
        docker-compose -f $COMPOSE_FILE restart
        print_success "Containers restarted"
        ;;

    logs)
        check_docker
        print_info "Showing logs (Ctrl+C to exit)..."
        docker-compose -f $COMPOSE_FILE logs -f
        ;;

    build)
        check_docker
        print_info "Building Next.js Docker image (development)..."
        docker-compose -f $COMPOSE_FILE build nextjs-dev
        print_success "Image built successfully"
        ;;

    build-prod)
        check_docker
        print_info "Building Next.js Docker image (production)..."
        docker-compose -f $COMPOSE_FILE build nextjs-prod
        print_success "Production image built successfully"
        ;;

    rebuild)
        check_docker
        print_info "Rebuilding and starting development..."
        docker-compose -f $COMPOSE_FILE up --build nextjs-dev
        ;;

    clean)
        check_docker
        print_warning "This will remove containers, networks, and volumes!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Cleaning up..."
            docker-compose -f $COMPOSE_FILE down -v
            print_success "Cleanup complete"
        else
            print_info "Cleanup cancelled"
        fi
        ;;

    shell)
        check_docker
        print_info "Opening shell in development container..."
        docker-compose -f $COMPOSE_FILE exec nextjs-dev sh
        ;;

    prod)
        check_docker
        print_info "Starting production build (this may take a few minutes)..."
        print_highlight "Access at: http://localhost:8080"
        print_info "Note: For GitHub Pages path, use http://localhost:8080/design-system-lab"
        docker-compose -f $COMPOSE_FILE --profile production up nextjs-prod
        ;;

    prod-bg)
        check_docker
        print_info "Starting production build in background..."
        docker-compose -f $COMPOSE_FILE --profile production up -d nextjs-prod
        print_success "Production container started!"
        print_highlight "Access at: http://localhost:8080"
        print_highlight "GitHub Pages path: http://localhost:8080/design-system-lab"
        print_info "View logs with: ./docker-nextjs.sh logs"
        ;;

    status)
        check_docker
        print_info "Running containers:"
        docker-compose -f $COMPOSE_FILE ps
        ;;

    health)
        check_docker
        print_info "Checking container health..."
        docker-compose -f $COMPOSE_FILE ps
        echo ""
        if docker ps --filter "name=nextjs-dev" --filter "health=healthy" | grep -q nextjs-dev; then
            print_success "Development container is healthy"
        elif docker ps --filter "name=nextjs-dev" | grep -q nextjs-dev; then
            print_warning "Development container is running but health check pending/unhealthy"
        else
            print_info "Development container is not running"
        fi

        if docker ps --filter "name=nextjs-prod" --filter "health=healthy" | grep -q nextjs-prod; then
            print_success "Production container is healthy"
        elif docker ps --filter "name=nextjs-prod" | grep -q nextjs-prod; then
            print_warning "Production container is running but health check pending/unhealthy"
        else
            print_info "Production container is not running"
        fi
        ;;

    help|--help|-h)
        show_usage
        ;;

    *)
        if [ -z "${1}" ]; then
            show_usage
        else
            print_error "Unknown command: ${1}"
            echo ""
            show_usage
            exit 1
        fi
        ;;
esac
