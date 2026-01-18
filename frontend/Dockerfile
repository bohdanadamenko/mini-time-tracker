# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Build argument for backend URL (used at build time for rewrites)
ARG BACKEND_URL=http://localhost:3001
ENV BACKEND_URL=${BACKEND_URL}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
