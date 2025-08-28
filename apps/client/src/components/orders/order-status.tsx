import type { useOrdersConnection } from '@/api/orders'
import { cn } from '@/lib/utils'

export const OrderStatus = ({
  status
}: {
  status: ReturnType<typeof useOrdersConnection>['status']
}) => {
  const statusText: Record<
    'pending' | 'connecting' | 'idle' | 'error',
    { text: string; color: string }
  > = {
    pending: {
      text: 'Live',
      color: 'bg-green-500'
    },
    connecting: {
      text: 'Reconnecting...',
      color: 'bg-yellow-500 animate-pulse'
    },
    idle: {
      text: 'Offline',
      color: 'bg-red-500'
    },
    error: {
      text: 'Error',
      color: 'bg-red-500'
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <div className={cn('w-2 h-2 rounded-full', statusText[status].color)} />
      <span className='text-xs text-muted-foreground'>{statusText[status].text}</span>
    </div>
  )
}
