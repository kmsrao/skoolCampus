# ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# If your prod config name is different, adjust below
RUN npm run build -- --configuration production

# ---- Nginx stage ----
FROM nginx:alpine

# Copy Angular build output
# ⚠️ Replace "your-angular-project-name" with the actual folder name inside dist
COPY --from=build /app/dist/your-angular-project-name/ /usr/share/nginx/html

# Optional: custom nginx config for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
