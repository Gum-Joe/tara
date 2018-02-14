# Dockerfile to isolate a tara instance for testing
FROM node:latest
ENV NODE_ENV development

WORKDIR /
RUN git clone https://github.com/Gum-Joe/tara
WORKDIR /tara

RUN yarn
RUN ./node_modules/.bin/lerna bootstrap
RUN ./scripts/build-node-sass.sh

CMD yarn start
