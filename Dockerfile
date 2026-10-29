# Use a node base image
FROM node:26.11.1-alpine3.24 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the Vite app
RUN npm run build

# Use a lightweight, unprivileged web server to serve the static files
FROM nginxinc/nginx-unprivileged:1.31.6-alpine3.24

# Update base packages (needs root; image defaults to the unprivileged nginx user)
USER root
RUN apk update && apk upgrade --no-cache

# Copy the Vite app build files to the NGINX directory
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Drop back to the unprivileged nginx user for runtime
USER nginx

# Expose the port that NGINX is running on
EXPOSE 8080

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]