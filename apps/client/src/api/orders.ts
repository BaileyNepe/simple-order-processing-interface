import { api } from '@/utils/trpc'

export const useOrdersConnection = () => {
  const utils = api.useUtils()
  return api.eventSubscription.useSubscription(undefined, {
    onData: () => {
      utils.getOrders.invalidate()
    }
  })
}
