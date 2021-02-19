FROM nginx:1.17.1-alpine

RUN apk update
RUN apk upgrade
RUN apk add npm

RUN mkdir /app

COPY . /app
COPY ./nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

RUN npm install
RUN npm run build
