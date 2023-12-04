FROM nginx:1.17.1-alpine

RUN apk update
RUN apk upgrade
RUN apk add npm

RUN mkdir /app

COPY . /app
COPY ./nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

ARG EXPENSES_API_ENDPOINT
ARG AUTH_API_ENDPOINT
ARG EXPCAT_API_ENDPOINT
ARG GOOGLE_CLIENT_ID
ARG EXPENSESV2_API_ENDPOINT
ARG GAMES_API_ENDPOINT

RUN npm install
RUN REACT_APP_GAMES_API_ENDPOINT=$GAMES_API_ENDPOINT REACT_APP_EXPENSES_V2_API_ENDPOINT=$EXPENSESV2_API_ENDPOINT REACT_APP_EXPCAT_API_ENDPOINT=$EXPCAT_API_ENDPOINT REACT_APP_AUTH_API_ENDPOINT=$AUTH_API_ENDPOINT REACT_APP_EXPENSES_API_ENDPOINT=$EXPENSES_API_ENDPOINT REACT_APP_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID npm run build
