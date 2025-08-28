# Simple build and serve for client
FROM oven/bun:1.2.19-slim

WORKDIR /app

COPY package.json bun.lock bunfig.toml turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/client/package.json ./apps/client/
COPY apps/server/package.json ./apps/server/

RUN bun install

COPY . .

RUN cd packages/shared && bun run build && cd ../..

WORKDIR /app/apps/client

EXPOSE 3001

ENV NODE_ENV=production
ENV VITE_SERVER_URL=http://localhost:5001

RUN bun run build
CMD ["bun", "vite", "preview", "--host", "0.0.0.0", "--port", "3001"]