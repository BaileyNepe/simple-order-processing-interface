export const PRODUCTS = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Phone', price: 699 },
  { id: 3, name: 'Headphones', price: 199 },
  { id: 4, name: 'Tablet', price: 499 }
]

export const getProductById = (id: number) => {
  return PRODUCTS.find((product) => product.id === id)
}

export const getProductByStringId = (id: string) => {
  const numericId = parseInt(id, 10)
  return Number.isNaN(numericId) ? undefined : getProductById(numericId)
}
