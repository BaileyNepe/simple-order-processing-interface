import { z } from 'zod'

export type OrderStatus = 'Pending' | 'Processing' | 'Completed'

export const createOrderSchema = z.object({
  customer: z
    .string()
    .min(1, 'Customer name is required')
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name must be less than 100 characters')
    .trim(),
  productId: z.string().min(1, 'Please select a product')
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
