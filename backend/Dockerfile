# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm install --legacy-peer-deps

COPY . .

# Run the build command which compiles TypeScript to JavaScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install production dependencies
COPY --from=builder /usr/src/app/package*.json ./

# Install production dependencies
RUN npm install --legacy-peer-deps --omit=dev

# Copy compiled code from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"] 