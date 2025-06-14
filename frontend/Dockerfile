# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package management files
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application source code and public assets
COPY public ./public
COPY src ./src

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.21.6-alpine

# Copy the build output from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"] 