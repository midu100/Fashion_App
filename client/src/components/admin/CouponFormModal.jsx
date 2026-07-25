import React, { useState, useEffect } from 'react'
import AdminModal from './AdminModal'

const emptyForm = { code: '', type: 'percentage', value: '', minOrder: '', usageLimit: '', expiresAt: '', isActive: true }

const inputClass =
  'w-full bg-dark-card border border-dark-border text-cream placeholder:text-cream-muted/40 px-4 py-2.5 text-[13px] font-body rounded-[10px] outline-none focus:border-primary transition-colors'
const labelClass = 'text-[11px] font-ui tracking-wide text-cream-muted uppercase block mb-1.5'

// ====== Coupon add/edit form (JSON payload) ======
const CouponFormModal = ({ open, onClose, initial, onSave }) => {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const isEdit = !!initial

  useEffect(() => {
    if (!open) return
    setError('')
    if (initial) {
      setForm({
        code: initial.code || '',
        type: initial.type || 'percentage',
        value: initial.value ?? '',
        minOrder: initial.minOrder ?? '',
        usageLimit: initial.usageLimit ?? '',
        expiresAt: initial.expiresAt ? initial.expiresAt.slice(0, 10) : '',
        isActive: initial.isActive ?? true,
      })
    } else {
      setForm(emptyForm)
    }
  }, [open, initial])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.code) return setError('Coupon code is required.')
    if (form.type !== 'shipping' && !form.value) return setError('A value is required for this discount type.')

    const payload = {
      code: form.code.toUpperCase().trim(),
      type: form.type,
      value: form.type === 'shipping' ? 0 : Number(form.value),
      minOrder: form.minOrder ? Number(form.minOrder) : 0,
      usageLimit: form.usageLimit === '' ? null : Number(form.usageLimit),
      expiresAt: form.expiresAt || null,
      isActive: form.isActive,
    }

    try {
      setSaving(true)
      await onSave(payload, isEdit)
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminModal open={open} onClose={onClose} title={isEdit ? 'Edit Coupon' : 'Create Coupon'} subtitle={isEdit ? 'Update discount code' : 'New promo / discount code'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-[8px] py-2 px-3 text-[12px] font-body text-center">{error}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Code</label>
            <input name="code" value={form.code} onChange={handleChange} placeholder="SS26LAUNCH" className={`${inputClass} uppercase`} />
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
              <option value="percentage" className="bg-dark-card">Percentage (%)</option>
              <option value="fixed" className="bg-dark-card">Fixed ($)</option>
              <option value="shipping" className="bg-dark-card">Free Shipping</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{form.type === 'percentage' ? 'Percent off (%)' : form.type === 'fixed' ? 'Amount off ($)' : 'Value (n/a)'}</label>
            <input name="value" type="number" value={form.value} onChange={handleChange} disabled={form.type === 'shipping'} placeholder={form.type === 'percentage' ? '20' : '50'} className={`${inputClass} disabled:opacity-40`} />
          </div>
          <div>
            <label className={labelClass}>Min order ($)</label>
            <input name="minOrder" type="number" value={form.minOrder} onChange={handleChange} placeholder="0" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Usage limit</label>
            <input name="usageLimit" type="number" value={form.usageLimit} onChange={handleChange} placeholder="unlimited" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Expires</label>
            <input name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-[13px] font-body text-cream-muted cursor-pointer">
          <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} className="accent-primary w-4 h-4" />
          Active
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="flex-1 py-3 bg-primary text-dark text-[12px] font-ui tracking-[0.15em] font-semibold rounded-[10px] hover:bg-primary-light transition-colors cursor-pointer active:scale-[0.98] disabled:opacity-60">
            {saving ? 'SAVING…' : isEdit ? 'Save Changes' : 'Create Coupon'}
          </button>
          <button type="button" onClick={onClose} className="px-6 py-3 border border-dark-border text-cream-muted text-[12px] font-ui tracking-[0.15em] rounded-[10px] hover:text-cream hover:border-cream-muted/40 transition-colors cursor-pointer">
            Cancel
          </button>
        </div>
      </form>
    </AdminModal>
  )
}

export default CouponFormModal
