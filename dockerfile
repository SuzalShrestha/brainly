FROM node:22-alpine AS base

# Stage 1 - Install dependencies 
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2 - Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3 - Production image
FROM base AS runner
ENV NODE_ENV=production
USER node
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder --chown=node:node /app/public ./public
EXPOSE 3000
CMD ["node", "public/server.js"]