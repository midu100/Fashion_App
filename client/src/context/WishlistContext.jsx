import React, { createContext, useContext, useState, useEffect } from 'react'
import { wishlistServices, mapProduct } from '../api'
import { useAuth } from './AuthContext'

// ====== Wishlist Context ======
// Guests → localStorage. Logged-in → MongoDB (per user). On login the guest
// wishlist is merged into the account, then the server copy becomes the source.
const WishlistContext = createContext(null)

const STORAGE_KEY = 'kn_wishlist'

const readInitial = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.log(error)
    return []
  }
}

// Normalise a product (API-mapped or wishlist snapshot) to the stored shape
const toSnapshot = (p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  price: p.price,
  oldPrice: p.oldPrice,
  discount: p.discount,
  image: p.image,
  hoverImage: p.hoverImage,
  sizes: p.sizes,
})

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState(readInitial)

  // ====== Persist locally on every change (base + guest + offline)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.log(error)
    }
  }, [items])

  // ====== On login: merge guest items into the account, then load the server copy
  useEffect(() => {
    if (!isAuthenticated) return
    let active = true
    const sync = async () => {
      try {
        const res = await wishlistServices.get()
        const server = (res?.wishlist || []).map(mapProduct).map(toSnapshot)
        const serverIds = new Set(server.map((p) => p.id))

        // push guest-only items up to the account
        const localOnly = items.filter((it) => !serverIds.has(it.id))
        for (const it of localOnly) {
          try { await wishlistServices.toggle(it.id) } catch (e) { console.log(e) }
        }

        let merged = server
        if (localOnly.length) {
          const res2 = await wishlistServices.get()
          merged = (res2?.wishlist || []).map(mapProduct).map(toSnapshot)
        }
        if (active) setItems(merged)
      } catch (error) {
        console.log(error)
      }
    }
    sync()
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const isWishlisted = (id) => items.some((it) => it.id === id)

  // ====== Toggle (optimistic local + server when logged in)
  const toggleWishlist = (product) => {
    setItems((prev) =>
      prev.some((it) => it.id === product.id)
        ? prev.filter((it) => it.id !== product.id)
        : [...prev, toSnapshot(product)]
    )
    if (isAuthenticated) wishlistServices.toggle(product.id).catch((e) => console.log(e))
  }

  const removeFromWishlist = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
    if (isAuthenticated) wishlistServices.toggle(id).catch((e) => console.log(e))
  }

  const clearWishlist = () => {
    if (isAuthenticated) items.forEach((it) => wishlistServices.toggle(it.id).catch((e) => console.log(e)))
    setItems([])
  }

  const value = {
    items,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    wishlistCount: items.length,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

// ====== Hook
export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}
