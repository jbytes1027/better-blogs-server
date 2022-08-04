FROM node:18-alpine

WORKDIR /opt/app

COPY . .

RUN npm ci --only=production

CMD npm start