FROM node:10.14.1

COPY ./app /app
WORKDIR /app

RUN npm install -g npm@6.4.1
RUN npm install

CMD ["npm", "start"]
