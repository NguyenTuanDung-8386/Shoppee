import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiCheck } from 'react-icons/fi'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [editing, setEditing]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [form, setForm]         = useState({
    username: user?.username || '',
    phone:    user?.phone    || '',
    address:  user?.address  || '',
  })
  const [pwForm, setPwForm]     = useState({ old_password: '', new_password: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.patch('/auth/profile/', form)
      setUser(prev => ({ ...prev, ...data }))
      toast.success('Profile updated!')
      setEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePwChange = async (e) => {
    e.preventDefault()
    if (pwForm.new_password !== pwForm.confirm) {
      toast.error('Passwords do not match'); return
    }
    setPwLoading(true)
    try {
      await api.post('/auth/change-password/', {
        old_password: pwForm.old_password,
        new_password: pwForm.new_password,
      })
      toast.success('Password changed!')
      setPwForm({ old_password: '', new_password: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change password')
    } finally {
      setPwLoading(false)
    }
  }

  const avatarLetter = user?.username?.[0]?.toUpperCase() || 'U'

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-4">My Profile</h1>

      {/* Avatar + Name */}
      <div className="bg-white rounded-lg p-6 mb-4 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-shopee-500 text-white flex items-center justify-center text-3xl font-extrabold shrink-0">
          {avatarLetter}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{user?.username}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          {user?.is_seller && (
            <span className="inline-block mt-1 bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded">
              Seller Account
            </span>
          )}
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-white rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-700">Account Information</h2>
          {!editing && (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-sm text-shopee-500 hover:underline">
              <FiEdit2 size={13} /> Edit
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Username</label>
              <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="input-field" placeholder="+1234567890" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Default Address</label>
              <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                className="input-field resize-none" rows={2} placeholder="Your default shipping address" />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={loading} className="btn-primary px-5">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="btn-outline px-5">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            {[
              { icon: <FiUser size={15}/>,   label: 'Username', value: user?.username },
              { icon: <FiMail size={15}/>,   label: 'Email',    value: user?.email },
              { icon: <FiPhone size={15}/>,  label: 'Phone',    value: user?.phone || '—' },
              { icon: <FiMapPin size={15}/>, label: 'Address',  value: user?.address || '—' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 text-sm">
                <span className="text-gray-400 mt-0.5">{icon}</span>
                <span className="text-gray-500 w-20 shrink-0">{label}</span>
                <span className="text-gray-800 font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Member Since', value: new Date(user?.created_at).toLocaleDateString() },
          { label: 'Account Type', value: user?.is_seller ? 'Seller' : 'Buyer' },
          { label: 'Status', value: 'Active' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg p-4 text-center">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-bold text-gray-700 mt-0.5">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
