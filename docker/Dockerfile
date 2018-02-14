# Dockerfile to isolate a tara instance for testing
FROM node:latest
ENV NODE_ENV development

WORKDIR /
RUN git clone https://github.com/Gum-Joe/tara
WORKDIR /tara
RUN git checkout move-to-electron-webpack

RUN git pull && ./scripts/build.sh

CMD yarn start
