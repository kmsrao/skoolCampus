############################################
# BASE IMAGE
############################################
FROM node:20 AS base
WORKDIR /app
COPY package*.json ./

############################################
# BUILD STAGE
############################################
FROM base AS build

# Install all dependencies including devDependencies
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Force Prisma to generate Debian-compatible binaries
ENV PRISMA_CLI_BINARY_TARGETS="debian-openssl-1.1.x"

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build NestJS application
RUN npm run build


############################################
# PRODUCTION STAGE
############################################
FROM base AS prod

WORKDIR /app

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled NestJS output
COPY --from=build /app/dist ./dist

# Copy Prisma Client + Engines
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]
