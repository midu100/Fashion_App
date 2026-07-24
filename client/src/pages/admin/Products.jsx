import React, { useState, useEffect, useCallback } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { formatPrice } from '../../data/products'
import { productServices, categoryServices } from '../../api'
import ProductFormModal from '../../components/admin/ProductFormModal'

const inputClass =
  'w-full bg-dark-card border border-dark-border text-cream placeholder:text-cream-muted/40 px-4 py-2.5 text-[13px] font-body rounded-[10px] outline-none focus:border-primary transition-colors'

const Products = () => {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  // ====== Load products (admin list — includes buyPrice + totalStock)
  const loadProducts = useCallback(async () => {
    try {
      const res = await productServices.getAdminProducts()
      setItems(res?.productList || [])
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
    categoryServices
      .getAll()
      .then((res) => setCategories(res?.categories || []))
      .catch((err) => console.log(err))
  }, [loadProducts])

  const filtered = items.filter((p) => p.title?.toLowerCase().includes(search.toLowerCase()))

  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (product) => { setEditing(product); setModalOpen(true) }

  // ====== Create / Update → API (modal builds the FormData)
  const handleSave = async (formData, slug, isEdit) => {
    const res = isEdit
      ? await productServices.updateProduct(editing.slug, formData)
      : await productServices.createProduct(formData)
    toast.success(res?.message || 'Saved', { position: 'top-center' })
    setModalOpen(false)
    loadProducts()
  }

  // ====== Delete → API
  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) return
    try {
      const res = await productServices.deleteProduct(product.slug)
      toast.success(res?.message || 'Deleted', { position: 'top-center' })
      setItems((prev) => prev.filter((p) => p._id !== product._id))
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      {/* ====== Header ====== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[1.7rem] font-display font-bold text-cream">Products</h1>
          <p className="text-[13px] font-body text-cream-muted mt-1">{items.length} products in your catalog.</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-primary text-dark text-[12px] font-ui tracking-[0.15em] font-semibold px-5 py-3 rounded-[10px] hover:bg-primary-light transition-colors cursor-pointer active:scale-95 self-start"
        >
          <FiPlus size={16} />
          Add Product
        </button>
      </div>

      {/* ====== Search ====== */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-muted" size={15} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className={`${inputClass} pl-11`}
        />
      </div>

      {/* ====== Table ====== */}
      <div className="bg-dark-secondary border border-dark-border rounded-[18px] p-2 md:p-4 overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="text-left text-[11px] font-ui tracking-wide text-cream-muted/70 border-b border-dark-border">
              <th className="px-3 py-3 font-medium">Product</th>
              <th className="px-3 py-3 font-medium">Category</th>
              <th className="px-3 py-3 font-medium">Sell</th>
              <th className="px-3 py-3 font-medium">Buy</th>
              <th className="px-3 py-3 font-medium">Profit/unit</th>
              <th className="px-3 py-3 font-medium">Stock</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const profit = (p.price || 0) - (p.buyPrice || 0)
              return (
                <tr key={p._id} className="border-b border-dark-border/60 last:border-0 text-[13px] hover:bg-dark-card/40 transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.thumbnail} alt={p.title} className="w-11 h-11 rounded-[10px] object-cover border border-dark-border shrink-0" />
                      <span className="font-ui text-cream">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-body text-cream-muted">{p.category?.name || '—'}</td>
                  <td className="px-3 py-3 font-body text-cream font-medium">{formatPrice(p.price)}</td>
                  <td className="px-3 py-3 font-body text-cream-muted">{formatPrice(p.buyPrice)}</td>
                  <td className={`px-3 py-3 font-body font-medium ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatPrice(profit)}</td>
                  <td className="px-3 py-3 font-body text-cream-muted">
                    <span className={p.totalStock <= 0 ? 'text-red-400' : p.totalStock <= 10 ? 'text-amber-400' : ''}>
                      {p.totalStock ?? 0}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-[9px] font-ui font-bold rounded-full px-2 py-0.5 uppercase border ${p.isActive ? 'text-green-400 bg-green-400/10 border-green-400/30' : 'text-cream-muted bg-dark-card border-dark-border'}`}>
                      {p.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-[8px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(p)} className="w-8 h-8 rounded-[8px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-red-400 hover:border-red-400/50 transition-colors cursor-pointer">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {loading ? (
          <p className="text-center py-16 text-[13px] font-ui tracking-wide text-cream-muted uppercase animate-pulse">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-16 text-[13px] font-ui tracking-wide text-cream-muted uppercase">No products found</p>
        ) : null}
      </div>

      {/* ====== Add / Edit modal ====== */}
      <ProductFormModal open={modalOpen} onClose={() => setModalOpen(false)} initial={editing} onSave={handleSave} categories={categories} />
    </div>
  )
}

export default Products
