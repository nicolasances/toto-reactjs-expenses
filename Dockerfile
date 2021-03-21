FROM nginx:1.17.1-alpine

RUN apk update
RUN apk upgrade
RUN apk add npm

RUN mkdir /app

COPY . /app
COPY ./nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

ARG EXPENSES_API_ENDPOINT
ARG GOOGLE_CLIENT_ID

RUN npm install
RUN REACT_APP_EXPENSES_API_ENDPOINT=$EXPENSES_API_ENDPOINT REACT_APP_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID npm run build
