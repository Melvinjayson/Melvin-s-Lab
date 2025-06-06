# Build stage
FROM node:20-slim as builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies with specific cache settings and parallel installation
RUN npm config set cache-min 9999999 && \
    npm ci --prefer-offline --no-audit --no-progress --max-old-space-size=4096 && \
    npm cache clean --force

# Copy only necessary project files
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src/ ./src/
COPY public/ ./public/

# Build the project with optimized settings
RUN NODE_ENV=production npm run build

# Production stage
FROM nginx:alpine

# Install wget for health check
RUN apk add --no-cache wget

# Create nginx user if it doesn't exist
RUN adduser -D -H -u 101 -s /sbin/nologin nginx || true

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]