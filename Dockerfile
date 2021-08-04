FROM keymetrics/pm2:latest-alpine


WORKDIR /
RUN mkdir -p /nodejs/dgc-tw-vaccine-service/
WORKDIR /nodejs/dgc-tw-vaccine-service/
# Bundle APP files
COPY package*.json /nodejs/dgc-tw-vaccine-service/
COPY . /nodejs/dgc-tw-vaccine-service/

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install
RUN npm rebuild

# Show current folder structure in logs
RUN ls -al -R

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]