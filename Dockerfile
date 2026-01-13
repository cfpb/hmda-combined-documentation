### Build Stage ###
# Use node as the base image
FROM node:20-alpine3.19 AS build-stage

# Set the working directory to /app
WORKDIR /app

# Add Zscaler Root CA certificate
COPY zscaler-root-public.cert /usr/local/share/ca-certificates/
RUN apk add ca-certificates --no-cache --no-check-certificate && \
    update-ca-certificates && \
    cp /etc/ssl/certs/ca-certificates.crt /app/ca-certificates.crt
ARG NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/zscaler-root-public.cert

RUN apk update \
    && apk upgrade \
    && apk cache clean

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
# RUN npm install
RUN yarn set version 4.1.0
COPY yarn.lock .yarn .yarnrc.yml ./
RUN yarn install

# Copy the rest of the project files
COPY . .

# Set Build Version for Footer
ARG DOCKER_TAG
ENV DOCKER_TAG=${DOCKER_TAG}

# Build the Docusaurus project
ENV NODE_ENV=production
ENV BABEL_ENV=production
RUN yarn build

# Remove devDependancies
# RUN npm prune --production

### Run Stage ###
FROM node:20-alpine3.19 AS run-stage
COPY --from=build-stage  /app/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

# Set the working directory to /app
WORKDIR /app

# Copy files from build-stage
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/docusaurus.config.js /app/docusaurus.config.js
COPY --from=build-stage /app/sidebars.js /app/sidebars.js
COPY --from=build-stage /app/src /app/src
COPY --from=build-stage /app/node_modules /app/node_modules
COPY --from=build-stage /app/build /app/build

# Non-root user
RUN addgroup -S hmda_group && adduser -S hmda_user -G hmda_group
USER hmda_user

EXPOSE 8080
CMD ["yarn", "run", "serve", "--", "--port", "8080", "--host", "0.0.0.0"]