import React, { useState, useEffect, useCallback } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { categoryServices } from '../../api'
import CategoryFormModal from '../../components/admin/CategoryFormModal'

const Categories = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  // ====== Load categories
  const loadCategories = useCallback(async () => {
    try {
      const res = await categoryServices.getAll()
      setItems(res?.categories || [])
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadCategories() }, [loadCategories])

  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (cat) => { setEditing(cat); setModalOpen(true) }

  // ====== Create / Update → API
  const handleSave = async (formData, isEdit) => {
    const res = isEdit
      ? await categoryServices.updateCategory(editing._id, formData)
      : await categoryServices.createCategory(formData)
    toast.success(res?.message || 'Saved', { position: 'top-center' })
    setModalOpen(false)
    loadCategories()
  }

  // ====== Delete → API
  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}"?`)) return
    try {
      const res = await categoryServices.deleteCategory(cat._id)
      toast.success(res?.message || 'Deleted', { position: 'top-center' })
      setItems((prev) => prev.filter((c) => c._id !== cat._id))
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
          <h1 className="text-[1.7rem] font-display font-bold text-cream">Categories</h1>
          <p className="text-[13px] font-body text-cream-muted mt-1">{items.length} categories organizing your catalog.</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-primary text-dark text-[12px] font-ui tracking-[0.15em] font-semibold px-5 py-3 rounded-[10px] hover:bg-primary-light transition-colors cursor-pointer active:scale-95 self-start"
        >
          <FiPlus size={16} />
          Add Category
        </button>
      </div>

      {/* ====== Grid ====== */}
      {loading ? (
        <p className="text-center py-20 text-[13px] font-ui tracking-wide text-cream-muted uppercase animate-pulse">Loading…</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-dark-border rounded-[16px] py-20 text-center">
          <p className="text-[13px] font-ui tracking-[0.2em] text-cream-muted uppercase">No categories yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((cat) => (
            <div key={cat._id} className="group bg-dark-secondary border border-dark-border rounded-[18px] overflow-hidden hover:border-primary/40 transition-colors">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={cat.thumbnail} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent" />
                {!cat.isActive && (
                  <span className="absolute top-3 left-3 text-[9px] font-ui font-bold text-cream/80 bg-dark/70 border border-dark-border rounded-full px-2.5 py-1 uppercase">
                    Hidden
                  </span>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cat)} className="w-8 h-8 rounded-[8px] bg-dark/70 backdrop-blur-md border border-dark-border flex items-center justify-center text-cream hover:text-primary hover:border-primary transition-colors cursor-pointer">
                    <FiEdit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat)} className="w-8 h-8 rounded-[8px] bg-dark/70 backdrop-blur-md border border-dark-border flex items-center justify-center text-cream hover:text-red-400 hover:border-red-400/50 transition-colors cursor-pointer">
                    <FiTrash2 size={14} />
                  </button>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-[16px] font-display font-semibold text-cream">{cat.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-[12px] font-body text-cream-muted leading-relaxed line-clamp-2 min-h-[32px]">{cat.description}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border">
                  <span className="text-[11px] font-ui tracking-wide text-cream-muted">{cat.slug}</span>
                  <span className={`text-[10px] font-ui font-bold uppercase ${cat.isActive ? 'text-green-400' : 'text-cream-muted/60'}`}>
                    {cat.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ====== Add / Edit modal ====== */}
      <CategoryFormModal open={modalOpen} onClose={() => setModalOpen(false)} initial={editing} onSave={handleSave} />
    </div>
  )
}

export default Categories
