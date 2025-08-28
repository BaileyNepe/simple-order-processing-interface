import { keepPreviousData, QueryCache, QueryClient } from '@tanstack/react-query'
import { createTRPCReact } from '@trpc/react-query'
import { toast } from 'sonner'
import type { AppRouter } from '../../../server/src/routers'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: keepPreviousData
    },
    mutations: {
      retry: false,
      onError: (error) => {
        toast.error(error.message)
      }
    }
  },
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message, {
        action: {
          label: 'retry',
          onClick: () => {
            queryClient.invalidateQueries()
          }
        }
      })
    }
  })
})

export const api = createTRPCReact<AppRouter>()
