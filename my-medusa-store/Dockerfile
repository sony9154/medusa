FROM node:20-alpine

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9000

CMD ["sh", "-c", "sleep 10 && npx medusa db:migrate && npx medusa develop"]