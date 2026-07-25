import React, { useState, useEffect, useCallback } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { couponServices } from '../../api'
import PageHeader from '../../components/admin/PageHeader'
import StatusBadge from '../../components/admin/StatusBadge'
import Panel from '../../components/admin/Panel'
import CouponFormModal from '../../components/admin/CouponFormModal'

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No expiry')
const valueText = (c) => (c.type === 'percentage' ? `${c.value}%` : c.type === 'fixed' ? `$${c.value}` : 'Free shipping')

const Discounts = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = useCallback(async () => {
    try {
      const res = await couponServices.getAll()
      setCoupons(res?.coupons || [])
    } catch (err) {
      console.log(err)
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (c) => { setEditing(c); setModalOpen(true) }

  const handleSave = async (payload, isEdit) => {
    const res = isEdit ? await couponServices.update(editing._id, payload) : await couponServices.create(payload)
    toast.success(res?.message || 'Saved', { position: 'top-center' })
    setModalOpen(false)
    load()
  }

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete coupon "${c.code}"?`)) return
    try {
      await couponServices.remove(c._id)
      toast.success('Coupon deleted', { position: 'top-center' })
      setCoupons((prev) => prev.filter((x) => x._id !== c._id))
    } catch (err) {
      console.log(err)
      toast.error('Delete failed')
    }
  }

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code)
    toast.success(`Copied ${code}`, { position: 'top-center' })
  }

  const isExpired = (c) => c.expiresAt && new Date(c.expiresAt) < new Date()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discounts"
        subtitle="Promo codes customers can apply at checkout."
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-2 bg-primary text-dark text-[12px] font-ui tracking-[0.15em] font-semibold px-5 py-3 rounded-[10px] hover:bg-primary-light transition-colors cursor-pointer active:scale-95">
            <FiPlus size={16} />
            Create Discount
          </button>
        }
      />

      <Panel title="Discount Codes">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="text-left text-[11px] font-ui tracking-wide text-cream-muted/70 border-b border-dark-border">
                <th className="px-3 py-3 font-medium">Code</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Value</th>
                <th className="px-3 py-3 font-medium">Min order</th>
                <th className="px-3 py-3 font-medium">Usage</th>
                <th className="px-3 py-3 font-medium">Expires</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-b border-dark-border/60 last:border-0 text-[13px] hover:bg-dark-card/40 transition-colors">
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center gap-2 font-ui text-cream font-medium">
                      <span className="bg-dark-card border border-dark-border rounded-[6px] px-2 py-1 text-primary tracking-wider">{c.code}</span>
                      <button onClick={() => copyCode(c.code)} className="text-cream-muted hover:text-primary transition-colors cursor-pointer"><FiCopy size={13} /></button>
                    </span>
                  </td>
                  <td className="px-3 py-3.5 font-body text-cream-muted capitalize">{c.type}</td>
                  <td className="px-3 py-3.5 font-body text-cream font-medium">{valueText(c)}</td>
                  <td className="px-3 py-3.5 font-body text-cream-muted">{c.minOrder ? `$${c.minOrder}` : '—'}</td>
                  <td className="px-3 py-3.5 font-body text-cream-muted">{c.usedCount} / {c.usageLimit ?? '∞'}</td>
                  <td className="px-3 py-3.5 font-body text-cream-muted">{fmtDate(c.expiresAt)}</td>
                  <td className="px-3 py-3.5"><StatusBadge status={isExpired(c) ? 'Expired' : c.isActive ? 'Active' : 'Inactive'} /></td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-[8px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-primary hover:border-primary transition-colors cursor-pointer"><FiEdit2 size={14} /></button>
                      <button onClick={() => handleDelete(c)} className="w-8 h-8 rounded-[8px] border border-dark-border flex items-center justify-center text-cream-muted hover:text-red-400 hover:border-red-400/50 transition-colors cursor-pointer"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? (
            <p className="text-center py-14 text-[13px] font-ui tracking-wide text-cream-muted uppercase animate-pulse">Loading…</p>
          ) : coupons.length === 0 ? (
            <p className="text-center py-14 text-[13px] font-ui tracking-wide text-cream-muted uppercase">No discount codes yet</p>
          ) : null}
        </div>
      </Panel>

      <CouponFormModal open={modalOpen} onClose={() => setModalOpen(false)} initial={editing} onSave={handleSave} />
    </div>
  )
}

export default Discounts
