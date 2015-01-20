FROM node:0.10.33

RUN mkdir -p /usr/src/app
RUN npm install grunt-cli -g
WORKDIR /usr/src/app

ADD . /usr/src/app
RUN npm install
RUN grunt

EXPOSE 8002

CMD [ "node", "./build/server/Init.js" ]
