# Multi-stage Dockerfile with Node.js 20 and Python 3 for LangGraph AI
FROM node:20-slim

# Install Python 3, pip, and system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    && ln -sf /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python AI dependencies
COPY ai/requirements.txt ./ai/requirements.txt
RUN pip install --no-cache-dir --break-system-packages -r ./ai/requirements.txt

# Install Node backend dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "src/server.js"]
