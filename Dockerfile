FROM node:14.15.4-alpine
WORKDIR /app
ADD . .
RUN npm install
CMD node server/server.js