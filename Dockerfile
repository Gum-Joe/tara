# Dockerfile to isolate a tara instance for testing

# Setup env
FROM node:latest
ENV NODE_ENV development

# Copy code
RUN mkdir -p /build/tara
COPY . /build/tara
WORKDIR /build/tara

RUN ./scripts/build.sh

CMD yarn start