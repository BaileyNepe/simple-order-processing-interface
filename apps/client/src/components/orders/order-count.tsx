import { api } from '@/utils/trpc'

export const OrdersCount = () => {
  const orders = api.getOrders.useQuery()
  return (
    <span className='text-muted-foreground text-sm'>
      {orders.data?.length || 0} orders
    </span>
  )
}
