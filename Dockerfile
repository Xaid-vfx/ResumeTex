# Use a smaller base image
FROM ubuntu:22.04 as builder

# Avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install minimal TeX Live and only required packages
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    && rm -rf /var/lib/apt/lists/*

# Use Node.js base image for the final stage
FROM node:18-slim

# Copy TeX Live from builder
COPY --from=builder /usr/share/texlive /usr/share/texlive
COPY --from=builder /usr/local/share/texlive /usr/local/share/texlive
COPY --from=builder /usr/bin/pdf* /usr/bin/
COPY --from=builder /usr/bin/latex /usr/bin/
COPY --from=builder /usr/bin/xelatex /usr/bin/

# Set up working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 