import React, { createContext, useContext, useState, useEffect } from 'react'

// ====== Cart Context (localStorage-backed, no backend needed) ======
const CartContext = createContext(null)

const STORAGE_KEY = 'kn_cart'

// Lazy initial read so we don't flash an empty cart on reload
const readInitial = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.log(error)
    return []
  }
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readInitial)

  // ====== Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.log(error)
    }
  }, [items])

  // ====== Add to cart (merge by id + size)
  const addToCart = (product, size = null, qty = 1) => {
    setItems((prev) => {
      const key = (it) => it.id === product.id && it.size === size
      const existing = prev.find(key)
      if (existing) {
        return prev.map((it) => (key(it) ? { ...it, qty: it.qty + qty } : it))
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          qty,
        },
      ]
    })
  }

  // ====== Remove a specific line (id + size)
  const removeFromCart = (id, size) =>
    setItems((prev) => prev.filter((it) => !(it.id === id && it.size === size)))

  // ====== Update quantity (min 1)
  const updateQty = (id, size, qty) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id && it.size === size ? { ...it, qty: Math.max(1, qty) } : it))
    )

  const clearCart = () => setItems([])

  // ====== Derived totals
  const cartCount = items.reduce((sum, it) => sum + it.qty, 0)
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0)

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    cartCount,
    subtotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// ====== Hook
export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
