FROM node:17

WORKDIR /usr/expo-notification-server

COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./

RUN npm install -g nodemon
RUN npm install

COPY src ./src

EXPOSE 4545

CMD npm run serve
