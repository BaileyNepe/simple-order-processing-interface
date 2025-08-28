import { orders } from '@/routers/orders/data'
import type { Order } from '@/routers/orders/types'

/**
 * Reset the orders array to empty state
 */
export const resetOrders = () => {
  orders.length = 0
}

/**
 * Populate orders with test data
 */
export const populateTestOrders = (testOrders: Order[]) => {
  resetOrders()
  orders.push(...testOrders)
}

/**
 * Create a test order with default values
 */
export const createTestOrder = (overrides: Partial<Order> = {}): Order => ({
  id: crypto.randomUUID(),
  customer: 'Test Customer',
  productId: '1',
  status: 'Pending',
  ...overrides
})

/**
 * Get a copy of current orders (to avoid mutation issues in tests)
 */
export const getCurrentOrders = (): Order[] => [...orders]
