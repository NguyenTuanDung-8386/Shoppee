import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import { Spinner } from '../components/common/UI'
import { FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [loading, setLoading]     = useState(isEdit)
  const [saving, setSaving]       = useState(false)
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name: '', description: '', price: '', original_price: '',
    stock: '', category_id: '', is_active: true, image: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    api.get('/products/categories/').then(r => setCategories(r.data.results || r.data))
    if (isEdit) {
      api.get(`/products/${id}/`).then(r => {
        const p = r.data
        setForm({
          name:           p.name,
          description:    p.description || '',
          price:          p.price,
          original_price: p.original_price || '',
          stock:          p.stock,
          category_id:    p.category?.id || '',
          is_active:      p.is_active,
          image:          p.image || '',
        })
      }).finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      const payload = { ...form }
      if (!payload.original_price) delete payload.original_price
      if (!payload.category_id) delete payload.category_id
      if (isEdit) {
        await api.patch(`/products/${id}/`, payload)
        toast.success('Cập nhật sản phẩm thành công!')
      } else {
        await api.post('/products/', payload)
        toast.success('Tạo sản phẩm thành công!')
      }
      navigate('/my-products')
    } catch (err) {
      setErrors(err.response?.data || {})
      toast.error('Vui lòng kiểm tra lại thông tin')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/my-products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-shopee-500 mb-4">
        <FiArrowLeft size={14} /> Quay lại
      </Link>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-shopee-500 px-6 py-4 text-white">
          <h1 className="text-xl font-bold">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">URL Hình ảnh</label>
            <input
              value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
            {form.image && (
              <img src={form.image} alt="preview"
                className="mt-2 w-28 h-28 object-cover rounded border"
                onError={e => { e.target.style.display='none' }} />
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="input-field" placeholder="Nhập tên sản phẩm" required />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Mô tả</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="input-field resize-none" rows={4} placeholder="Mô tả sản phẩm..." />
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Giá ($) <span className="text-red-500">*</span>
              </label>
              <input type="number" step="0.01" min="0" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="input-field" placeholder="0.00" required />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Giá gốc ($)</label>
              <input type="number" step="0.01" min="0" value={form.original_price}
                onChange={e => setForm({ ...form, original_price: e.target.value })}
                className="input-field" placeholder="Để trống nếu không giảm giá" />
            </div>
          </div>

          {/* Stock + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Tồn kho <span className="text-red-500">*</span>
              </label>
              <input type="number" min="0" value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })}
                className="input-field" placeholder="0" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Danh mục</label>
              <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                className="input-field">
                <option value="">Chọn danh mục</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.is_active}
                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-300 peer-checked:bg-shopee-500 rounded-full transition-colors
                after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white
                after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
            </label>
            <span className="text-sm font-semibold text-gray-600">
              {form.is_active ? 'Đang hiển thị' : 'Đang ẩn'}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary px-8 py-2.5">
              {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo sản phẩm')}
            </button>
            <Link to="/my-products" className="btn-outline px-8 py-2.5">Hủy</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
