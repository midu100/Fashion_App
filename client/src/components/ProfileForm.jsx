import React, { useState, useRef } from 'react'
import { FiCamera } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Avatar from './common/Avatar'
import { authServices } from '../api'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'w-full bg-dark-card border border-dark-border text-cream placeholder:text-cream-muted/40 px-4 py-3 text-[14px] font-body rounded-[10px] outline-none focus:border-primary transition-colors'
const labelClass = 'text-[11px] font-ui tracking-wide text-cream-muted uppercase block mb-1.5'

// ====== Profile editor — upload avatar + update name / phone / address ======
const ProfileForm = () => {
  const { user, updateUser } = useAuth()
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  // ====== Pick a picture (show an instant local preview)
  const handlePick = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file', { position: 'top-center' })
    setAvatarFile(file)
    setPreview(URL.createObjectURL(file))
  }

  // ====== Save → PUT /auth/profile (multipart) → refresh context
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName) return toast.error('Name is required', { position: 'top-center' })

    const fd = new FormData()
    fd.append('fullName', form.fullName)
    fd.append('phone', form.phone)
    fd.append('address', form.address)
    if (avatarFile) fd.append('avatar', avatarFile)

    try {
      setSaving(true)
      const res = await authServices.updateProfile(fd)
      if (res?.user) updateUser(res.user)
      setAvatarFile(null)
      toast.success(res?.message || 'Profile updated', { position: 'top-center' })
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.message || 'Update failed', { position: 'top-center' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ====== Avatar ====== */}
      <div className="flex items-center gap-5">
        <div className="relative">
          {preview ? (
            <img src={preview} alt="preview" className="w-20 h-20 rounded-full object-cover border border-dark-border" />
          ) : (
            <Avatar src={user?.avatar} name={user?.fullName} size={80} />
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-dark flex items-center justify-center border-2 border-dark-secondary hover:bg-primary-light transition-colors cursor-pointer"
            title="Upload picture"
          >
            <FiCamera size={14} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePick} className="hidden" />
        </div>
        <div>
          <p className="text-[15px] font-ui text-cream font-semibold">{user?.fullName || 'Your name'}</p>
          <p className="text-[12px] font-body text-cream-muted">{user?.email}</p>
          <button type="button" onClick={() => fileRef.current?.click()} className="mt-2 text-[11px] font-ui tracking-wide text-primary hover:text-primary-light transition-colors cursor-pointer">
            {avatarFile ? 'Change selected photo' : 'Upload a picture'}
          </button>
        </div>
      </div>

      {/* ====== Fields ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input value={user?.email || ''} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="+880 1XXX..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Address</label>
          <input name="address" value={form.address} onChange={handleChange} placeholder="Dhaka, BD" className={inputClass} />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-dark text-[12px] font-ui tracking-[0.15em] font-semibold px-7 py-3 rounded-[10px] hover:bg-primary-light transition-colors cursor-pointer active:scale-95 disabled:opacity-60"
        >
          {saving ? 'SAVING…' : 'SAVE CHANGES'}
        </button>
      </div>
    </form>
  )
}

export default ProfileForm
