FROM node:23-alpine

WORKDIR /home/pc-builder

COPY package*.json ./

COPY ./client/package*.json ./client/

RUN npm install

RUN npm --prefix ./client install

COPY . .

RUN mv ./bootstrap.min.css ./client/node_modules/bootstrap/dist/css/

EXPOSE 5000

EXPOSE 8000

CMD ["npm", "run", "dev"]
