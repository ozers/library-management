FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD [ "node", "--inspect=0.0.0.0:9229", "dist/index.js" ]
