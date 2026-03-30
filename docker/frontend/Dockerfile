FROM node:20-alpine AS base

WORKDIR /srv/app

# Development
FROM base AS development
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production
FROM base AS production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /srv/app/.next ./.next
COPY --from=build /srv/app/public ./public
COPY --from=build /srv/app/next.config.js ./
EXPOSE 3000
CMD ["npm", "run", "start"]
