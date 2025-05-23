FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

WORKDIR /app/backend
EXPOSE 5001

CMD ["npm", "start"] 