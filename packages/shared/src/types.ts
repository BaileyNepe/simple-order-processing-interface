import { z } from 'zod'
import { getProductByStringId } from './products'

export type OrderStatus = 'Pending' | 'Processing' | 'Completed'

export const createOrderSchema = z.object({
  customer: z
    .string()
    .trim()
    .min(1, 'Customer name is required')
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name must be less than 100 characters'),
  productId: z
    .string()
    .min(1, 'Please select a product')
    .refine(
      (val) => {
        return !!getProductByStringId(val)
      },
      {
        message: 'Please select a product'
      }
    )
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
