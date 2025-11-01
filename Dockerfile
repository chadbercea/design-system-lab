# Multi-stage Dockerfile for MUI Sandbox with Storybook
# Optimized for both development hot-reload and production builds

# Stage 1: Base dependencies
FROM node:20-alpine AS base

# Install system dependencies for node-gyp (needed by some npm packages)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Stage 2: Development dependencies
FROM base AS deps

# Install all dependencies (including devDependencies for Storybook)
RUN npm ci

# Stage 3: Development environment
FROM base AS development

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Expose Storybook port
EXPOSE 6006

# Set environment
ENV NODE_ENV=development

# Start Storybook with hot-reload
CMD ["npm", "run", "storybook", "--", "--host", "0.0.0.0"]

# Stage 4: Production build
FROM base AS builder

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Build Storybook for production
RUN npm run build-storybook

# Stage 5: Production environment
FROM nginx:alpine AS production

# Copy built Storybook files from builder
COPY --from=builder /app/storybook-static /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
