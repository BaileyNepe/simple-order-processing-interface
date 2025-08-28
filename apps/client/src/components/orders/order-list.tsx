import { getProductByStringId } from '@order-processing/shared'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { api } from '@/utils/trpc'

export const OrderList = () => {
  const orders = api.getOrders.useQuery()

  const rows = ['Order ID', 'Customer', 'Product', 'Price', 'Status']

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
  }

  if (orders.isLoading)
    return (
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <Skeleton className='w-full h-10 mb-4' />
        <Skeleton className='w-full h-10 mb-4' />
      </div>
    )

  if (orders.isError)
    return (
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center text-destructive'>
              <p>Error: {orders.error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )

  if (orders.data && orders.data.length > 0) {
    return (
      <div className='rounded-md border'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='border-b bg-muted/50'>
              {rows.map((row) => (
                <th key={row} className='p-4 text-left font-medium'>
                  {row}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.data.map((order) => {
              const product = getProductByStringId(order.productId)
              return (
                <tr key={order.id} className='border-b hover:bg-muted/30'>
                  <td className='p-4'>{order.id.slice(0, 8)}...</td>
                  <td className='p-4'>{order.customer}</td>
                  <td className='p-4'>{product?.name || 'Unknown Product'}</td>
                  <td className='p-4'>${product?.price || 0}</td>
                  <td className='p-4'>
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        statusColors[order.status]
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className='rounded-md border p-8 text-center text-muted-foreground'>
      <p>No orders yet. Create your first order above!</p>
    </div>
  )
}
