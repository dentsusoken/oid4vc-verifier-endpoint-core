FROM node:20-bullseye

RUN apt -y update
RUN apt -y install openssl
RUN apt -y install jq
RUN npm install -g eckles

WORKDIR /app

RUN chown -R node:node /app

USER node