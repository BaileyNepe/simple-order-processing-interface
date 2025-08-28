import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  useRouterState
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ThemeProvider } from '@/components/theme-provider'
import Loader from '@/components/ui/loader'
import { Toaster } from '@/components/ui/sonner'
import '../index.css'

export const Route = createRootRouteWithContext()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: 'Order Management'
      },
      {
        name: 'description',
        content: 'Order Management is a web application'
      }
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.ico'
      }
    ]
  })
})

function RootComponent() {
  const isFetching = useRouterState({
    select: (s) => s.isLoading
  })

  return (
    <>
      <HeadContent />
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        disableTransitionOnChange
        storageKey='vite-ui-theme'
      >
        <div className='grid grid-rows-[auto_1fr] h-svh'>
          {isFetching ? <Loader /> : <Outlet />}
        </div>
        <Toaster richColors />
      </ThemeProvider>
      <TanStackRouterDevtools position='bottom-left' />
      <ReactQueryDevtools position='bottom' buttonPosition='bottom-right' />
    </>
  )
}
