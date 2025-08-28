import { QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, httpSubscriptionLink, retryLink, splitLink } from '@trpc/client'

import type { FC, PropsWithChildren } from 'react'
import { api, queryClient } from '@/utils/trpc'

export const TRPCContext: FC<PropsWithChildren> = ({ children }) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:5001'
  return (
    <api.Provider
      client={api.createClient({
        links: [
          splitLink({
            condition: (op) => op.type === 'subscription',
            true: [
              retryLink({ retry: () => true }),
              httpSubscriptionLink({
                url: `${serverUrl}/trpc`
              })
            ],
            false: httpBatchLink({
              url: `${serverUrl}/trpc`
            })
          })
        ]
      })}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  )
}
