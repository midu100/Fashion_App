import React, { useState, useEffect } from 'react'
import AdminModal from './AdminModal'

const emptyForm = { name: '', description: '', isActive: true }

const inputClass =
  'w-full bg-dark-card border border-dark-border text-cream placeholder:text-cream-muted/40 px-4 py-2.5 text-[13px] font-body rounded-[10px] outline-none focus:border-primary transition-colors'

const labelClass = 'text-[11px] font-ui tracking-wide text-cream-muted uppercase block mb-1.5'

// ====== Category add/edit form — builds multipart FormData (thumbnail file) ======
// backend: name, slug, description, thumbnail(file). thumbnail required on create.
const CategoryFormModal = ({ open, onClose, initial, onSave }) => {
  const [form, setForm] = useState(emptyForm)
  const [thumbnail, setThumbnail] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const isEdit = !!initial

  useEffect(() => {
    if (!open) return
    setThumbnail(null)
    setError('')
    if (initial) {
      setForm({ name: initial.name || '', description: initial.description || '', isActive: initial.isActive ?? true })
    } else {
      setForm(emptyForm)
    }
  }, [open, initial])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  const slugify = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name) return setError('Category name is required.')
    if (!isEdit && !thumbnail) return setError('A thumbnail image is required.')

    const fd = new FormData()
    fd.append('name', form.name.toUpperCase())
    fd.append('slug', slugify(form.name))
    fd.append('description', form.description)
    if (thumbnail) fd.append('thumbnail', thumbnail)

    try {
      setSaving(true)
      await onSave(fd, isEdit)
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
      title={isEdit ? 'Edit Category' : 'Add Category'}
      subtitle={isEdit ? 'Update category details' : 'Create a new category'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-[8px] py-2 px-3 text-[12px] font-body text-center">
            {error}
          </p>
        )}

        <div>
          <label className={labelClass}>Name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Category name" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Thumbnail {isEdit && <span className="text-cream-muted/50 normal-case">(leave empty to keep)</span>}</label>
          <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className={`${inputClass} !py-2 file:mr-3 file:border-0 file:bg-primary file:text-dark file:rounded-[6px] file:px-3 file:py-1 file:text-[11px] file:cursor-pointer`} />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Short description" className={`${inputClass} resize-none`} />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="flex-1 py-3 bg-primary text-dark text-[12px] font-ui tracking-[0.15em] font-semibold rounded-[10px] hover:bg-primary-light transition-colors cursor-pointer active:scale-[0.98] disabled:opacity-60">
            {saving ? 'SAVING…' : isEdit ? 'Save Changes' : 'Add Category'}
          </button>
          <button type="button" onClick={onClose} className="px-6 py-3 border border-dark-border text-cream-muted text-[12px] font-ui tracking-[0.15em] rounded-[10px] hover:text-cream hover:border-cream-muted/40 transition-colors cursor-pointer">
            Cancel
          </button>
        </div>
      </form>
    </AdminModal>
  )
}

export default CategoryFormModal
