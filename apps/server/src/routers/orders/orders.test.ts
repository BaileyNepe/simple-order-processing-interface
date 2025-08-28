import { beforeEach, describe, expect, it } from 'vitest'
import { createTrpcTestClient } from '@/utils/mockTrpc'
import {
  createTestOrder,
  getCurrentOrders,
  populateTestOrders,
  resetOrders
} from '@/utils/testHelpers'
import type { Order } from './types'

const client = createTrpcTestClient()

beforeEach(() => {
  resetOrders()
})

describe('Orders API', () => {
  describe('createOrder', () => {
    it('should create an order successfully with valid data', async () => {
      const result = await client.createOrder.mutate({
        customer: 'John Doe',
        productId: '1'
      })

      expect(result).toEqual({
        success: true,
        orderId: expect.any(String)
      })

      // Verify the order was added to the data store
      const orders = getCurrentOrders()
      expect(orders).toHaveLength(1)
      expect(orders[0].id).toEqual(result.orderId)
    })

    it('should create multiple orders with unique IDs', async () => {
      const orderData1 = { customer: 'John Doe', productId: '1' }
      const orderData2 = { customer: 'Jane Smith', productId: '2' }

      const result1 = await client.createOrder.mutate(orderData1)
      const result2 = await client.createOrder.mutate(orderData2)

      expect(result1.orderId).not.toBe(result2.orderId)

      const orders = getCurrentOrders()
      expect(orders).toHaveLength(2)

      // Orders should be added to the beginning (unshift)
      expect(orders[0].id).toBe(result2.orderId)
      expect(orders[1].id).toBe(result1.orderId)
    })

    it('should reject order with empty customer name', async () => {
      const orderData = {
        customer: '',
        productId: '1'
      }

      await expect(client.createOrder.mutate(orderData)).rejects.toThrow()
    })

    it('should reject order with only whitespace customer name', async () => {
      const orderData = {
        customer: '   ',
        productId: '1'
      }

      await expect(client.createOrder.mutate(orderData)).rejects.toThrow()
    })

    it('should reject order with customer name too short', async () => {
      const orderData = {
        customer: 'A',
        productId: '1'
      }

      await expect(client.createOrder.mutate(orderData)).rejects.toThrow()
    })

    it('should reject order with customer name too long', async () => {
      const orderData = {
        customer: 'A'.repeat(101), // 101 characters
        productId: '1'
      }

      await expect(client.createOrder.mutate(orderData)).rejects.toThrow()
    })

    it('should reject order with empty product ID', async () => {
      const orderData = {
        customer: 'John Doe',
        productId: ''
      }

      await expect(client.createOrder.mutate(orderData)).rejects.toThrow()
    })

    it('should trim whitespace from customer name', async () => {
      const orderData = {
        customer: '  John Doe  ',
        productId: '1'
      }

      const result = await client.createOrder.mutate(orderData)

      expect(result.success).toBe(true)
      const orders = getCurrentOrders()
      expect(orders[0].customer).toBe('John Doe')
    })
  })

  describe('getOrders', () => {
    it('should return empty array when no orders exist', async () => {
      const result = await client.getOrders.query()

      expect(result).toEqual([])
    })

    it('should return all orders when orders exist', async () => {
      const testOrders: Order[] = [
        createTestOrder({
          id: '1',
          customer: 'John Doe',
          productId: '1',
          status: 'Pending'
        }),
        createTestOrder({
          id: '2',
          customer: 'Jane Smith',
          productId: '2',
          status: 'Processing'
        }),
        createTestOrder({
          id: '3',
          customer: 'Bob Wilson',
          productId: '3',
          status: 'Completed'
        })
      ]

      populateTestOrders(testOrders)

      const result = await client.getOrders.query()

      expect(result).toHaveLength(3)
      expect(result).toEqual(testOrders)
    })

    it('should return orders in correct order (most recent first)', async () => {
      const testOrders: Order[] = [
        createTestOrder({ id: 'newest', customer: 'Latest Customer', productId: '1' }),
        createTestOrder({ id: 'middle', customer: 'Middle Customer', productId: '2' }),
        createTestOrder({ id: 'oldest', customer: 'First Customer', productId: '3' })
      ]

      populateTestOrders(testOrders)

      const result = await client.getOrders.query()

      expect(result[0].id).toBe('newest')
      expect(result[1].id).toBe('middle')
      expect(result[2].id).toBe('oldest')
    })

    it('should reflect real-time updates when new orders are created', async () => {
      // Start with existing orders
      const existingOrders: Order[] = [
        createTestOrder({ id: 'existing', customer: 'Existing Customer', productId: '1' })
      ]
      populateTestOrders(existingOrders)

      let result = await client.getOrders.query()
      expect(result).toHaveLength(1)

      // Create a new order
      await client.createOrder.mutate({
        customer: 'New Customer',
        productId: '2'
      })

      // Check that getOrders now returns both orders
      result = await client.getOrders.query()
      expect(result).toHaveLength(2)
      expect(result[0].customer).toBe('New Customer') // Most recent first
      expect(result[1].customer).toBe('Existing Customer')
    })

    it('should reject orders with invalid product IDs', async () => {
      const orderData = {
        customer: 'New Customer',
        productId: '999999'
      }

      await expect(client.createOrder.mutate(orderData)).rejects.toThrow()
    })
  })

  describe('Integration Tests', () => {
    it('should maintain data consistency between createOrder and getOrders', async () => {
      // Create multiple orders
      const orderData = [
        { customer: 'Alice Johnson', productId: '1' },
        { customer: 'Bob Smith', productId: '2' },
        { customer: 'Charlie Brown', productId: '3' }
      ]

      const createdOrders = []
      for (const data of orderData) {
        const result = await client.createOrder.mutate(data)
        createdOrders.push(result.orderId)
      }

      // Verify all orders are returned by getOrders
      const allOrders = await client.getOrders.query()

      expect(allOrders).toHaveLength(3)

      // Check that all created order IDs are present
      const retrievedIds = allOrders.map((order) => order.id)
      for (const orderId of createdOrders) {
        expect(retrievedIds).toContain(orderId)
      }

      // Verify order details
      expect(allOrders[0].customer).toBe('Charlie Brown') // Most recent
      expect(allOrders[1].customer).toBe('Bob Smith')
      expect(allOrders[2].customer).toBe('Alice Johnson') // Oldest
    })
  })
})
