# EXPERIMENTAL Docker support for angular2 build process.
# Build with: docker build -t $USER/angular:$(git rev-list -n 1 HEAD) .
FROM node:5.7.1
MAINTAINER Alex Eagle
# Copy only the shrinkwrapped dependencies
COPY npm-shrinkwrap.clean.json /home/npm-shrinkwrap.json
WORKDIR /home
# This install command results in a cachable node_modules directory
RUN npm install --silent

COPY . /home/

RUN npm run typings
RUN npm run build
