import type { OrderStatus } from '@order-processing/shared'

export type Order = {
  id: string
  customer: string
  productId: string
  status: OrderStatus
}
