# Use a specific Ubuntu version for better stability
FROM ubuntu:22.04 as builder

# Avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js and npm first
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Install all necessary TeX Live packages
RUN apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    texlive-latex-recommended \
    texlive-pictures \
    texlive-font-utils \
    texlive-fonts-extra \
    && rm -rf /var/lib/apt/lists/*

# Create and set working directory
WORKDIR /app

# Copy package files and config files first
COPY package*.json ./
COPY next.config.ts ./

# First, install React with specific version
RUN npm install react@18.2.0 react-dom@18.2.0 --legacy-peer-deps

# Then install other dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Disable all checks during build
ENV DISABLE_ESLINT_PLUGIN=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Create temp directory for LaTeX files with proper permissions
RUN mkdir -p /tmp/latex-temp && chmod 777 /tmp/latex-temp

# Expose the port (Railway uses PORT environment variable)
ENV PORT=3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 