FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies first (better layer caching)
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3000 9229

# Use node directly for production
CMD ["npm", "start"] 