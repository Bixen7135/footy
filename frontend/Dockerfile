# Stage 1: Dependencies
FROM oven/bun:1-slim AS deps

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies (deterministic)
RUN bun install --frozen-lockfile

# Stage 2: Builder
FROM oven/bun:1-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

# Set build-time environment variables
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build application
RUN bun run build

# Stage 3: Runner (production)
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs --create-home nextjs

# Copy built application (standalone output)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "server.js"]

# Stage 4: Dev image (for docker-compose)
FROM oven/bun:1-slim AS dev

WORKDIR /app

ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Keep tools needed for healthchecks / scripts in dev
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Pre-copy lockfiles for install caching (actual source is volume-mounted in compose)
COPY package.json bun.lockb* ./

# If bun.lockb isn't present yet, allow image build to succeed; compose will run a real install.
RUN bun install --frozen-lockfile || true

CMD ["bun", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]
