# Use Ubuntu 22.04 as base
FROM ubuntu:22.04

# Avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Install TeX Live packages
RUN apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    texlive-latex-recommended \
    texlive-pictures \
    texlive-font-utils \
    texlive-fonts-extra \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only necessary files for backend
COPY package*.json ./

# Install only the backend dependencies
RUN npm install --production --legacy-peer-deps \
    express@4.21.1 \
    cors@2.8.5 \
    mustache@4.2.0 \
    uuid@11.0.3

# Install dev dependencies with legacy-peer-deps
RUN npm install --save-dev --legacy-peer-deps \
    typescript@5 \
    @types/node@20 \
    @types/express@5.0.0 \
    @types/cors@2.8.17 \
    tsconfig-paths@4.2.0

# Copy backend files and TypeScript config
COPY tsconfig.backend.json ./tsconfig.json
COPY src ./src

# Compile TypeScript
RUN npx tsc

# Create temp directory for LaTeX
RUN mkdir -p /tmp/latex-temp && chmod 777 /tmp/latex-temp

# Expose port for API
ENV PORT=3001
EXPOSE 3001

# Start compiled server with path resolution
CMD ["node", "-r", "tsconfig-paths/register", "dist/app/api/generate-pdf/server.js"] 