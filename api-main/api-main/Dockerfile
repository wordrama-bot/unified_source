FROM node:21

WORKDIR /home/node/app
COPY ./ ./
RUN npm install
RUN npm run build

EXPOSE 5000
CMD [ "yarn", "start" ]
