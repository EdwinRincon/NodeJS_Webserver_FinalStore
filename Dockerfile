FROM node:14.15.4-alpine
WORKDIR /app
ADD package*.json ./
RUN npm install
ADD . .
CMD node server/server.js