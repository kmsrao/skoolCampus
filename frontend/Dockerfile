### Stage 1: Build Angular App
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✔ Use correct build command from angular.json :contentReference[oaicite:0]{index=0}
RUN npm run build 

### Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# ✔ Copy correct dist directory from angular.json
COPY --from=build /app/dist/skoolcampus/browser /usr/share/nginx/html/

# Use custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
