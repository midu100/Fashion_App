import React, { useState, useEffect } from 'react'
import { FiPlus, FiX } from 'react-icons/fi'
import AdminModal from './AdminModal'

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', '3XL']

const emptyVariant = () => ({ sku: '', size: 'M', color: '', stock: '' })

const emptyForm = {
  title: '', slug: '', description: '', category: '', price: '', buyPrice: '',
  discountPercentage: '', tags: '', isActive: true,
}

const inputClass =
  'w-full bg-dark-card border border-dark-border text-cream placeholder:text-cream-muted/40 px-4 py-2.5 text-[13px] font-body rounded-[10px] outline-none focus:border-primary transition-colors'

const labelClass = 'text-[11px] font-ui tracking-wide text-cream-muted uppercase block mb-1.5'

// ====== Product add/edit form — builds multipart FormData for the backend ======
// backend expects: title, slug, description, category(_id), price, buyPrice,
// discountPercentage, variants(JSON string), tags, isActive, thumbnail(file), images(files ≤4)
const ProductFormModal = ({ open, onClose, initial, onSave, categories = [] }) => {
  const [form, setForm] = useState(emptyForm)
  const [variants, setVariants] = useState([emptyVariant()])
  const [thumbnail, setThumbnail] = useState(null)
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const isEdit = !!initial

  // ====== Hydrate the form each time the modal opens
  useEffect(() => {
    if (!open) return
    setThumbnail(null)
    setImages([])
    setError('')
    if (initial) {
      setForm({
        title: initial.title || '',
        slug: initial.slug || '',
        description: initial.description || '',
        category: initial.category?._id || initial.category || '',
        price: initial.price ?? '',
        buyPrice: initial.buyPrice ?? '',
        discountPercentage: initial.discountPercentage ?? '',
        tags: (initial.tags || []).join(', '),
        isActive: initial.isActive ?? true,
      })
      setVariants(
        initial.variants?.length
          ? initial.variants.map((v) => ({ sku: v.sku, size: v.size, color: v.color, stock: v.stock }))
          : [emptyVariant()]
      )
    } else {
      setForm({ ...emptyForm, category: categories[0]?._id || '' })
      setVariants([emptyVariant()])
    }
  }, [open, initial, categories])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  // ====== Variant row helpers
  const updateVariant = (i, key, value) =>
    setVariants((prev) => prev.map((v, idx) => (idx === i ? { ...v, [key]: value } : v)))
  const addVariant = () => setVariants((prev) => [...prev, emptyVariant()])
  const removeVariant = (i) => setVariants((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev))

  const slugify = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  // ====== Submit → build FormData, hand to parent
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title) return setError('Product title is required.')
    if (!form.description) return setError('Description is required.')
    if (!form.category) return setError('Please select a category.')
    if (!form.price) return setError('Price is required.')
    if (!isEdit && !thumbnail) return setError('A thumbnail image is required.')

    for (const v of variants) {
      if (!v.sku || !v.color || !v.size || v.stock === '' || Number(v.stock) < 1)
        return setError('Each variant needs a SKU, size, color and stock (min 1).')
    }

    const slug = form.slug ? slugify(form.slug) : slugify(form.title)
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('slug', slug)
    fd.append('description', form.description)
    fd.append('category', form.category)
    fd.append('price', form.price)
    fd.append('buyPrice', form.buyPrice || 0)
    fd.append('discountPercentage', form.discountPercentage || 0)
    fd.append('isActive', form.isActive)
    fd.append('variants', JSON.stringify(variants.map((v) => ({ ...v, stock: Number(v.stock) }))))
    form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => fd.append('tags', t))
    if (thumbnail) fd.append('thumbnail', thumbnail)
    images.slice(0, 4).forEach((img) => fd.append('images', img))

    try {
      setSaving(true)
      await onSave(fd, slug, isEdit)
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Product' : 'Add Product'}
      subtitle={isEdit ? 'Update product details' : 'Create a new product'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-[8px] py-2 px-3 text-[12px] font-body text-center">
            {error}
          </p>
        )}

        <div>
          <label className={labelClass}>Title</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Product title" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Slug (optional)</label>
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="auto from title" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              <option value="" className="bg-dark-card">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id} className="bg-dark-card">{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Selling Price ($)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Buying Price ($)</label>
            <input name="buyPrice" type="number" value={form.buyPrice} onChange={handleChange} placeholder="cost" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Discount %</label>
            <input name="discountPercentage" type="number" value={form.discountPercentage} onChange={handleChange} placeholder="0" className={inputClass} />
          </div>
        </div>
        <p className="text-[11px] font-body text-cream-muted/60 -mt-2">
          Buying price is admin-only — it never shows on the storefront, only for your profit / loss.
        </p>

        {/* ====== Variants ====== */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass}>Variants (size · color · stock)</label>
            <button type="button" onClick={addVariant} className="inline-flex items-center gap-1 text-[11px] font-ui text-primary hover:text-primary-light cursor-pointer">
              <FiPlus size={13} /> Add
            </button>
          </div>
          <div className="space-y-2">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-[1.4fr_0.9fr_1fr_0.8fr_auto] gap-2 items-center">
                <input value={v.sku} onChange={(e) => updateVariant(i, 'sku', e.target.value)} placeholder="SKU" className={`${inputClass} !px-3 !py-2`} />
                <select value={v.size} onChange={(e) => updateVariant(i, 'size', e.target.value)} className={`${inputClass} !px-3 !py-2`}>
                  {SIZE_OPTIONS.map((s) => <option key={s} value={s} className="bg-dark-card">{s}</option>)}
                </select>
                <input value={v.color} onChange={(e) => updateVariant(i, 'color', e.target.value)} placeholder="Color" className={`${inputClass} !px-3 !py-2`} />
                <input type="number" value={v.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} placeholder="Qty" className={`${inputClass} !px-3 !py-2`} />
                <button type="button" onClick={() => removeVariant(i)} className="w-8 h-8 rounded-[8px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-red-400 hover:border-red-400/50 transition-colors cursor-pointer">
                  <FiX size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Tags (comma)</label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="wool, bomber" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Thumbnail {isEdit && <span className="text-cream-muted/50 normal-case">(leave empty to keep)</span>}</label>
            <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className={`${inputClass} !py-2 file:mr-3 file:border-0 file:bg-primary file:text-dark file:rounded-[6px] file:px-3 file:py-1 file:text-[11px] file:cursor-pointer`} />
          </div>
          <div>
            <label className={labelClass}>Gallery images (max 4)</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files || []))} className={`${inputClass} !py-2 file:mr-3 file:border-0 file:bg-dark-card file:text-cream file:rounded-[6px] file:px-3 file:py-1 file:text-[11px] file:cursor-pointer`} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Product description" className={`${inputClass} resize-none`} />
        </div>

        <label className="flex items-center gap-2 text-[13px] font-body text-cream-muted cursor-pointer">
          <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} className="accent-primary w-4 h-4" />
          Active (visible on storefront)
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="flex-1 py-3 bg-primary text-dark text-[12px] font-ui tracking-[0.15em] font-semibold rounded-[10px] hover:bg-primary-light transition-colors cursor-pointer active:scale-[0.98] disabled:opacity-60">
            {saving ? 'SAVING…' : isEdit ? 'Save Changes' : 'Add Product'}
          </button>
          <button type="button" onClick={onClose} className="px-6 py-3 border border-dark-border text-cream-muted text-[12px] font-ui tracking-[0.15em] rounded-[10px] hover:text-cream hover:border-cream-muted/40 transition-colors cursor-pointer">
            Cancel
          </button>
        </div>
      </form>
    </AdminModal>
  )
}

export default ProductFormModal
