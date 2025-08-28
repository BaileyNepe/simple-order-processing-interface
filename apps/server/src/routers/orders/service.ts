import type { OrderStatus } from '@order-processing/shared'
import { emitEvent } from '@/lib/eventEmitter'
import { orders } from './data'
import type { Order } from './types'

const PROCESSING_TIME = 2000
const COMPLETED_WAITING_TIME = 8000

const updateOrderStatus = (
  id: string,
  status: OrderStatus,
  time: number,
  onSuccess?: () => void
) => {
  setTimeout(() => {
    const order = orders.find((o) => o.id === id)
    if (order) {
      order.status = status
      emitEvent.emit('updateOrder')
    } else {
      // biome-ignore lint/suspicious/noConsole: This could throw an error or log to something like datadog
      console.error(`Order ${id} not found`)
      return
    }
    onSuccess?.()
  }, time)
}

export const uploadOrder = (order: Order) => {
  orders.unshift(order)

  emitEvent.emit('updateOrder')

  updateOrderStatus(order.id, 'Processing', PROCESSING_TIME, () => {
    updateOrderStatus(order.id, 'Completed', COMPLETED_WAITING_TIME)
  })
}
