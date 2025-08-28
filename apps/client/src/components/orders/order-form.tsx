import {
  type CreateOrderInput,
  createOrderSchema,
  PRODUCTS
} from '@order-processing/shared'
import { useId, useRef, useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { api } from '@/utils/trpc'

export const OrderForm = () => {
  const inputNameRef = useRef<HTMLInputElement>(null)
  const customerFieldId = useId()
  const productFieldId = useId()

  const createOrder = api.createOrder.useMutation()

  const [errors, setErrors] = useState<Partial<Record<keyof CreateOrderInput, string>>>(
    {}
  )
  const [formData, setFormData] = useState<CreateOrderInput>({
    customer: '',
    productId: ''
  })

  const handleInputChange = (field: keyof CreateOrderInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const resetForm = () => {
    setFormData({ customer: '', productId: '' })
    setErrors({})
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const validatedData = createOrderSchema.parse(formData)

      createOrder.mutate(validatedData, {
        onSuccess: () => {
          toast.success('Order created successfully!')
          resetForm()
          inputNameRef.current?.focus()
        },
        onError: (error) => {
          toast.error(error.message)
        }
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof CreateOrderInput, string>> = {}
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as keyof CreateOrderInput] = issue.message
          }
        })
        setErrors(newErrors)
        toast.error('Please fix the form errors')
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
        <CardDescription>
          Enter customer details and select a product to create an order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor={customerFieldId}>Customer Name</Label>
            <Input
              id={customerFieldId}
              name='customer'
              ref={inputNameRef}
              placeholder='Enter customer name...'
              value={formData.customer}
              onChange={(e) => handleInputChange('customer', e.target.value)}
              className={
                errors.customer ? 'border-red-500 focus-visible:ring-red-500' : ''
              }
            />
            {errors.customer && <p className='text-sm text-red-500'>{errors.customer}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor={productFieldId}>Product</Label>
            <select
              id={productFieldId}
              name='product'
              value={formData.productId}
              onChange={(e) => handleInputChange('productId', e.target.value)}
              className={cn(
                'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                errors.productId
                  ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50'
                  : '',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
              )}
            >
              <option value='' disabled>
                Select a product...
              </option>
              {PRODUCTS.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </select>
            {errors.productId && (
              <p className='text-sm text-red-500'>{errors.productId}</p>
            )}
          </div>

          <Button type='submit' className='w-full' disabled={createOrder.isPending}>
            {createOrder.isPending ? 'Submitting Order...' : 'Submit Order'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
