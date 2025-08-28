import { createFileRoute } from '@tanstack/react-router'
import { useOrdersConnection } from '@/api/orders'
import { OrdersCount } from '@/components/orders/order-count'
import { OrderForm } from '@/components/orders/order-form'
import { OrderList } from '@/components/orders/order-list'
import { OrderStatus } from '@/components/orders/order-status'

const HomeComponent = () => {
  const { status } = useOrdersConnection()

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8 space-y-8'>
      <OrderForm />
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>Recent Orders</h2>
          <div className='flex items-center gap-4'>
            <OrderStatus status={status} />
            <OrdersCount />
          </div>
        </div>
        <OrderList />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomeComponent
})
