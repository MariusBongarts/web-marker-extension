FROM node:8.7.0-alpine
RUN mkdir -p /srv/app/client
WORKDIR /srv/app/client

COPY package.json /srv/app/client
COPY package-lock.json /srv/app/client

RUN apk update && apk upgrade && \
    apk add --no-cache git

RUN npm install


COPY . /srv/app/client

CMD ["npm", "start"]
