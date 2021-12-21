### STAGE 1: Build ###
FROM node:16.3-alpine as development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nvidia/cuda:11.4.0-base-ubuntu20.04 as production

SHELL ["/bin/bash", "-c"]
ARG DEBIAN_FRONTEND=noninteractive

# Install nodejs
RUN apt update && apt -y upgrade
RUN apt install -y curl software-properties-common pciutils
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN add-apt-repository "deb https://deb.nodesource.com/node_16.x focal main"
RUN apt install -y nodejs

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/main"]
