/* eslint-disable no-console */

import { on } from 'node:events'
import { createOrderSchema } from '@order-processing/shared'
import { emitEvent } from '@/lib/eventEmitter'
import { publicProcedure, router } from '../lib/trpc'
import { orders } from './orders/data'
import { uploadOrder } from './orders/service'

export const appRouter = router({
  getOrders: publicProcedure.query(() => orders),

  createOrder: publicProcedure.input(createOrderSchema).mutation(({ input }) => {
    const orderId = crypto.randomUUID()

    uploadOrder({
      id: orderId,
      customer: input.customer,
      productId: input.productId,
      status: 'Pending'
    })

    return { success: true, orderId }
  }),

  eventSubscription: publicProcedure.subscription(async function* (opts) {
    for await (const _ of on(emitEvent, 'updateOrder', { signal: opts.signal })) {
      yield { data: 'updateOrder' }
    }
  })
})

export type AppRouter = typeof appRouter
