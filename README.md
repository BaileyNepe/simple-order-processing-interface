# Order Processing Application

A full-stack order processing application built with React, Express, and tRPC.

## Quick Start

### Option 1: Docker
```bash
docker compose up --build
```
- Client: http://localhost:3001
- Server: http://localhost:5001

### Option 2: Local Development
```bash
bun install
bun run dev
```
- Client: http://localhost:3001
- Server: http://localhost:5001

## Tech Stack
- **Frontend**: React, Vite, TanStack Router, Tailwind CSS
- **Backend**: Express, tRPC, Bun runtime
- **Shared**: TypeScript, Zod validation
- **Build**: Turbo monorepo

## Available Scripts
- `bun run dev` - Start development servers
- `bun run build` - Build for production
- `bun run check-types` - Type checking
- `bun run check` - Lint and format code

## Environment Variables
- `PORT` - Server port (default: 5001)
- `CORS_ORIGIN` - Allowed CORS origin
- `VITE_SERVER_URL` - Backend API URL (default: http://localhost:5001)