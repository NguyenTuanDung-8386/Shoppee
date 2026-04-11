import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', username: '', phone: '', password: '', password2: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    if (form.password !== form.password2) {
      setErrors({ password2: ['Passwords do not match'] })
      return
    }
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err) {
      setErrors(err.response?.data || {})
    } finally {
      setLoading(false)
    }
  }

  const field = (name, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={e => setForm({ ...form, [name]: e.target.value })}
        className="input-field"
        placeholder={placeholder}
        required={name !== 'phone'}
      />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name][0]}</p>}
    </div>
  )

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-shopee-500 px-8 py-6 text-white">
            <h1 className="text-2xl font-extrabold">Register</h1>
            <p className="text-white/80 text-sm mt-1">Create your Shoppee account</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            {field('email',     'Email',            'email',    'you@example.com')}
            {field('username',  'Username',         'text',     'johndoe')}
            {field('phone',     'Phone (optional)', 'tel',      '+1234567890')}
            {field('password',  'Password',         'password', '••••••••')}
            {field('password2', 'Confirm Password', 'password', '••••••••')}

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-shopee-500 font-semibold hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
