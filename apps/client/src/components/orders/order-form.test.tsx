import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/utils'
import { OrderForm } from './order-form'

// Mock the tRPC API
const mockMutate = vi.fn()
vi.mock('@/utils/trpc', () => ({
  api: {
    createOrder: {
      useMutation: () => ({
        mutate: mockMutate,
        isPending: false,
        isError: false
      })
    }
  }
}))

describe('OrderForm', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form elements', () => {
    renderWithProviders(<OrderForm />)

    expect(screen.getByLabelText(/customer name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/product/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit order/i })).toBeInTheDocument()
  })

  it('submits valid order', async () => {
    renderWithProviders(<OrderForm />)

    await user.type(screen.getByLabelText(/customer name/i), 'John Doe')
    await user.selectOptions(screen.getByLabelText(/product/i), '1')
    await user.click(screen.getByRole('button', { name: /submit order/i }))

    expect(mockMutate).toHaveBeenCalled()
    expect(mockMutate.mock.calls[0][0]).toEqual({
      customer: 'John Doe',
      productId: '1'
    })
  })
})
