FROM nginx:1.17.1-alpine

RUN apk update
RUN apk upgrade
RUN apk add npm

RUN mkdir /app

COPY . /app
COPY ./nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

ARG EXPENSES_API_ENDPOINT

RUN echo "Endpoint: $EXPENSES_API_ENDPOINT"

RUN npm install
RUN REACT_APP_EXPENSES_API_ENDPOINT=$EXPENSES_API_ENDPOINT npm run build
