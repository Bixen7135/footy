# syntax=docker/dockerfile:1.4

# Stage 1: Build dependencies
FROM python:3.11-slim AS builder

WORKDIR /build

# Install minimal build dependencies with retry for transient DNS failures
RUN for i in 1 2 3; do apt-get update && break || sleep 5; done && \
    apt-get install -y --no-install-recommends \
        gcc \
        make \
        libffi-dev \
        libssl-dev \
        python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies with pip cache mount for speed
COPY pyproject.toml README.md ./
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir build && \
    pip wheel --wheel-dir /wheels .

# Stage 2: Runtime image
FROM python:3.11-slim AS runtime

WORKDIR /app

# Create non-root user for security
RUN groupadd --gid 1000 footy \
    && useradd --uid 1000 --gid footy --shell /bin/bash --create-home footy

# Install runtime dependencies only with retry for transient DNS failures
RUN for i in 1 2 3; do apt-get update && break || sleep 5; done && \
    apt-get install -y --no-install-recommends libpq5 curl locales && \
    sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen && \
    rm -rf /var/lib/apt/lists/*

ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

# Copy wheels and install with cache mount
COPY --from=builder /wheels /wheels
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir /wheels/* && \
    rm -rf /wheels

# Copy application code
COPY --chown=footy:footy . .

# Switch to non-root user
USER footy

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
