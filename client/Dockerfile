# Stage 1: Build the React/Vite app
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY client/package*.json ./client/
RUN npm install
COPY client/ ./client/
WORKDIR /app/client
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
# Copy build files from Stage 1
COPY --from=builder /app/client/dist /usr/share/nginx/html
# Copy custom Nginx config to handle React Router 404s
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]