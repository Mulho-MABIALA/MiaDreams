FROM node:20-slim

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Install frontend dependencies and build
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY . .

RUN cd frontend && npm run build

EXPOSE 5000

CMD ["node", "backend/src/server.js"]
