# DELIMa Scholarship Matching System
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY Agent1/package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY Agent1/ .

# Expose port
EXPOSE 3333

# Start the server
CMD ["node", "server.js"]
