import axios from 'axios'
import { getCookie, getToken } from '../components/common/Services'

// ====== Axios instance ======
// Uses VITE_API_BASE_URL when set; falls back to the hosted Railway API.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://fashionapp-production-39f0.up.railway.app',
  withCredentials: true, // sends the cookie too (same-site setups)
  headers: { 'Content-Type': 'application/json' },
})

// ====== Attach token ======
// Prefer the localStorage token (works cross-host); fall back to the cookie.
api.interceptors.request.use(
  (config) => {
    const token = getToken() || getCookie('X_AS-TOKEN')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ====== Map a backend product → the shape the storefront components expect ======
// Backend: { _id, title, slug, category(ref/obj), price, discountPercentage, variants[{size,color,stock}], thumbnail, images[] }
// Storefront: { id, slug, name, category, price, oldPrice, discount, image, hoverImage, gallery, sizes, description, details }
export const mapProduct = (p) => {
  if (!p) return null
  const categoryName = p.category?.name || (typeof p.category === 'string' ? p.category : '') || 'UNCATEGORIZED'
  const sizes = [...new Set((p.variants || []).map((v) => v.size))]
  const disc = Number(p.discountPercentage) || 0
  const oldPrice = disc > 0 ? Math.round(p.price / (1 - disc / 100)) : undefined
  const gallery = [p.thumbnail, ...(p.images || [])].filter(Boolean)

  return {
    id: p._id,
    slug: p.slug,
    name: p.title,
    category: categoryName,
    price: p.price,
    oldPrice,
    discount: disc > 0 ? `${disc}% OFF` : undefined,
    image: p.thumbnail,
    hoverImage: p.images?.[0],
    gallery,
    sizes,
    description: p.description,
    details: (p.tags && p.tags.length ? p.tags : []),
    variants: p.variants || [],
    isActive: p.isActive,
  }
}

// ====== Auth services ======
export const authServices = {
  signUp: async (payload) => {
    const res = await api.post('/auth/signup', payload)
    return res.data
  },
  verifyOtp: async (payload) => {
    const res = await api.post('/auth/verify-otp', payload)
    return res.data
  },
  resendOtp: async (payload) => {
    const res = await api.post('/auth/resend-otp', payload)
    return res.data
  },
  signIn: async (payload) => {
    const res = await api.post('/auth/signin', payload)
    return res.data
  },
  getProfile: async () => {
    const res = await api.get('/auth/me')
    return res.data
  },
  updateProfile: async (formData) => {
    const res = await api.put('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
  forgotPassword: async (payload) => {
    const res = await api.post('/auth/forgot-password', payload)
    return res.data
  },
  logout: async () => {
    const res = await api.post('/auth/logout')
    return res.data
  },
}

// ====== Product services ======
export const productServices = {
  // storefront (buyPrice stripped server-side)
  getProducts: async (params) => {
    const res = await api.get('/product/allproducts', { params })
    return res.data
  },
  getProductBySlug: async (slug) => {
    const res = await api.get(`/product/${slug}`)
    return res.data
  },
  // admin (includes buyPrice + totalStock + profitPerUnit)
  getAdminProducts: async () => {
    const res = await api.get('/product/admin/list')
    return res.data
  },
  createProduct: async (formData) => {
    const res = await api.post('/product/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
  updateProduct: async (slug, formData) => {
    const res = await api.put(`/product/updateproduct/${slug}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
  deleteProduct: async (slug) => {
    const res = await api.delete(`/product/deleteproduct/${slug}`)
    return res.data
  },
}

// ====== Category services ======
export const categoryServices = {
  getAll: async () => {
    const res = await api.get('/category/allcategories')
    return res.data
  },
  createCategory: async (formData) => {
    const res = await api.post('/category/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
  updateCategory: async (id, formData) => {
    const res = await api.put(`/category/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
  deleteCategory: async (id) => {
    const res = await api.delete(`/category/delete/${id}`)
    return res.data
  },
}

// ====== Order services ======
export const orderServices = {
  placeOrder: async (payload) => {
    const res = await api.post('/order/place', payload)
    return res.data
  },
  track: async (orderNumber) => {
    const res = await api.get(`/order/track/${orderNumber}`)
    return res.data
  },
  getMyOrders: async () => {
    const res = await api.get('/order/my')
    return res.data
  },
  getAllOrders: async () => {
    const res = await api.get('/order/all')
    return res.data
  },
  updateStatus: async (id, status) => {
    const res = await api.put(`/order/${id}/status`, { status })
    return res.data
  },
}

// ====== Dashboard services ======
export const dashboardServices = {
  getOverview: async () => {
    const res = await api.get('/dashboard/overview')
    return res.data
  },
  getAnalytics: async () => {
    const res = await api.get('/dashboard/analytics')
    return res.data
  },
  getCustomers: async () => {
    const res = await api.get('/dashboard/customers')
    return res.data
  },
  getMarketing: async () => {
    const res = await api.get('/dashboard/marketing')
    return res.data
  },
  getReport: async (type) => {
    const res = await api.get(`/dashboard/report/${type}`)
    return res.data
  },
  getSettings: async () => {
    const res = await api.get('/dashboard/settings')
    return res.data
  },
  updateSettings: async (payload) => {
    const res = await api.put('/dashboard/settings', payload)
    return res.data
  },
}

// ====== Coupon services ======
export const couponServices = {
  validate: async (payload) => {
    const res = await api.post('/coupon/validate', payload)
    return res.data
  },
  getAll: async () => {
    const res = await api.get('/coupon/all')
    return res.data
  },
  create: async (payload) => {
    const res = await api.post('/coupon/create', payload)
    return res.data
  },
  update: async (id, payload) => {
    const res = await api.put(`/coupon/update/${id}`, payload)
    return res.data
  },
  remove: async (id) => {
    const res = await api.delete(`/coupon/delete/${id}`)
    return res.data
  },
}

// ====== Wishlist services ======
export const wishlistServices = {
  get: async () => {
    const res = await api.get('/wishlist')
    return res.data
  },
  toggle: async (productId) => {
    const res = await api.post('/wishlist/toggle', { productId })
    return res.data
  },
}

// ====== Review services ======
export const reviewServices = {
  getForProduct: async (productId) => {
    const res = await api.get(`/review/${productId}`)
    return res.data
  },
  create: async (payload) => {
    const res = await api.post('/review/create', payload)
    return res.data
  },
}

// ====== Newsletter services ======
export const newsletterServices = {
  subscribe: async (payload) => {
    const res = await api.post('/newsletter/subscribe', payload)
    return res.data
  },
}

// ====== AI Agent services (scaffold) ======
export const agentServices = {
  getSuggestions: async () => {
    const res = await api.get('/agent/suggestions')
    return res.data
  },
  getInsights: async () => {
    const res = await api.get('/agent/insights')
    return res.data
  },
  query: async (payload) => {
    const res = await api.post('/agent/query', payload)
    return res.data
  },
}

export default api
