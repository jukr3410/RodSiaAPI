FROM node:14

RUN mkdir -p /usr/local/app
# Create app directory
WORKDIR /usr/local/app

COPY . .

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]