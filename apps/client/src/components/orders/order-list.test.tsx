import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/utils'
import { OrderList } from './order-list'

const mockOrders = [
  {
    id: '1',
    customer: 'John Doe',
    productId: '1',
    status: 'Pending' as const
  }
]

const mockUseQuery = vi.fn()
vi.mock('@/utils/trpc', () => ({
  api: {
    getOrders: {
      useQuery: () => mockUseQuery()
    }
  }
}))

describe('OrderList', () => {
  it('shows empty state', () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false
    })

    renderWithProviders(<OrderList />)

    expect(screen.getByText(/no orders yet/i)).toBeInTheDocument()
  })

  it('renders orders table', () => {
    mockUseQuery.mockReturnValue({
      data: mockOrders,
      isLoading: false,
      isError: false
    })

    renderWithProviders(<OrderList />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })
})
