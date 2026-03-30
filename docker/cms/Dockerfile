FROM node:20-alpine AS base

WORKDIR /srv/app

# Development
FROM base AS development
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 1337
CMD ["npm", "run", "develop"]

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
COPY --from=build /srv/app/dist ./dist
COPY --from=build /srv/app/config ./config
COPY --from=build /srv/app/src ./src
COPY --from=build /srv/app/public ./public
EXPOSE 1337
CMD ["npm", "run", "start"]
