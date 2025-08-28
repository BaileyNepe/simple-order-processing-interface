import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type RenderOptions, render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

interface TestWrapperProps {
  children: ReactNode
}

export const TestWrapper = ({ children }: TestWrapperProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export const renderWithProviders = (
  ui: ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {}
) => {
  return render(ui, { wrapper: TestWrapper, ...options })
}
