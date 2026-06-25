# ==========================================
# Dockerfile — Opays HQ (multi-stage)
# ==========================================

# ---- Stage 1: Build frontend ----
FROM node:20-alpine AS frontend-builder
WORKDIR /app
RUN apk add --no-cache python3 g++ make
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Stage 2: Build backend ----
FROM node:20-alpine AS backend-builder
WORKDIR /app
RUN apk add --no-cache python3 g++ make
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx tsc --project tsconfig.server.json || true
# Copy server source for tsx runtime
RUN cp -r server dist-server/ 2>/dev/null || true

# ---- Stage 3: Production ----
FROM node:20-alpine
WORKDIR /app

# Install build tools for native modules (better-sqlite3), then remove them
RUN apk add --no-cache python3 g++ make
COPY package*.json ./
RUN npm ci --omit=dev && \
    apk del python3 g++ make && \
    rm -rf /root/.npm /root/.cache

# Copy built frontend
COPY --from=frontend-builder /app/dist ./dist

# Copy server
COPY --from=backend-builder /app/dist-server ./dist-server
COPY server/ ./server/

# Create data directory for SQLite
RUN mkdir -p /app/data

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["npx", "tsx", "server/index.ts"]
