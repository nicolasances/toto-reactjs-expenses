# Build stage
FROM node:20 AS build

ARG EXPENSES_API_ENDPOINT
ARG AUTH_API_ENDPOINT
ARG EXPCAT_API_ENDPOINT
ARG GOOGLE_CLIENT_ID
ARG EXPENSESV2_API_ENDPOINT
ARG GAMES_API_ENDPOINT
ARG INCAST_API_ENDPOINT

# NEXT_PUBLIC_* values are inlined in the browser bundle at build time: only public endpoints and the Google client id belong here, never secrets.
ENV NEXT_PUBLIC_EXPENSES_API_ENDPOINT=${EXPENSES_API_ENDPOINT}
ENV NEXT_PUBLIC_EXPENSES_V2_API_ENDPOINT=${EXPENSESV2_API_ENDPOINT}
ENV NEXT_PUBLIC_AUTH_API_ENDPOINT=${AUTH_API_ENDPOINT}
ENV NEXT_PUBLIC_EXPCAT_API_ENDPOINT=${EXPCAT_API_ENDPOINT}
ENV NEXT_PUBLIC_GAMES_API_ENDPOINT=${GAMES_API_ENDPOINT}
ENV NEXT_PUBLIC_INCAST_API_ENDPOINT=${INCAST_API_ENDPOINT}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

RUN npm run build

# Runtime stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/package.json /app/package-lock.json* ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts

RUN npm ci --omit=dev

# Cloud Run sets PORT (8080); `next start` listens on it.
EXPOSE 8080

CMD ["npm", "start"]
