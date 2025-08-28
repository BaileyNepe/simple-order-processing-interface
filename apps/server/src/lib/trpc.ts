import { initTRPC } from '@trpc/server'
import type { Context } from './context'

export const t = initTRPC.context<Context>().create({
  sse: {
    ping: { enabled: true, intervalMs: 5_000 },
    client: { reconnectAfterInactivityMs: 5_000 }
  }
})

export const router = t.router

export const publicProcedure = t.procedure
