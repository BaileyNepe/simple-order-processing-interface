FROM oven/bun:1.2.19-slim

WORKDIR /app

COPY package.json bun.lock bunfig.toml turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/client/package.json ./apps/client/
COPY apps/server/package.json ./apps/server/

RUN bun install

COPY . .


RUN bun run build --filter=@order-processing/shared
RUN bun run build --filter=server

WORKDIR /app/apps/server

EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["bun", "run", "start"]