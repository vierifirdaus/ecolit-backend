FROM node:18-alpine as backend

WORKDIR /backend

COPY package*.json .

RUN npm install -g nodemon

RUN npm install

COPY . .

CMD [ "sh", "-c", "npx prisma migrate dev --name init && npm start" ]