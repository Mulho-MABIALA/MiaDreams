# ── Stage 1 : build du frontend ──────────────────────────────
FROM node:20-slim AS frontend-builder
WORKDIR /build
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
COPY public/ ./public/
RUN cd frontend && npm run build

# ── Stage 2 : image de production ────────────────────────────
FROM node:20-slim
WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

COPY backend/ ./backend/
COPY public/ ./public/
COPY --from=frontend-builder /build/frontend/dist ./frontend/dist

EXPOSE 5000
CMD ["node", "backend/src/server.js"]
