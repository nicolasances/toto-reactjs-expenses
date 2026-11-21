# Build stage
FROM node:20 AS build

ARG EXPENSES_API_ENDPOINT
ARG AUTH_API_ENDPOINT
ARG EXPCAT_API_ENDPOINT
ARG GOOGLE_CLIENT_ID
ARG EXPENSESV2_API_ENDPOINT
ARG GAMES_API_ENDPOINT

# NEXT_PUBLIC_* values are inlined in the browser bundle at build time: only public endpoints and the Google client id belong here, never secrets.
ENV NEXT_PUBLIC_EXPENSES_API_ENDPOINT=${EXPENSES_API_ENDPOINT}
ENV NEXT_PUBLIC_EXPENSES_V2_API_ENDPOINT=${EXPENSESV2_API_ENDPOINT}
ENV NEXT_PUBLIC_AUTH_API_ENDPOINT=${AUTH_API_ENDPOINT}
ENV NEXT_PUBLIC_EXPCAT_API_ENDPOINT=${EXPCAT_API_ENDPOINT}
ENV NEXT_PUBLIC_GAMES_API_ENDPOINT=${GAMES_API_ENDPOINT}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

RUN npm run build

# Runtime stage: runs the standalone server emitted by `output: "standalone"`.
# next.config.ts is resolved at build time, so no TypeScript or npm install is needed here.
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
# Cloud Run sets PORT (8080); bind on all interfaces so the container is reachable.
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 8080

CMD ["node", "server.js"]
