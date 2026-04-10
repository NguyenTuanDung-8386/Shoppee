import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const PLACEHOLDER = 'https://via.placeholder.com/60x60?text=?'

export default function Checkout() {
  const { cartItems, cartTotal, fetchCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    shipping_address: user?.address || '',
    note: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.shipping_address.trim()) { toast.error('Please enter a shipping address'); return }
    if (cartItems.length === 0) { toast.error('Your cart is empty'); return }
    setLoading(true)
    try {
      const { data } = await api.post('/orders/', form)
      await fetchCart()
      toast.success('Order placed successfully!')
      navigate(`/orders`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div className="bg-white rounded-lg p-5">
            <h2 className="font-bold text-gray-700 mb-3">Shipping Information</h2>

            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
              <input value={user?.username || ''} disabled className="input-field bg-gray-50 text-gray-500" />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
              <input value={user?.email || ''} disabled className="input-field bg-gray-50 text-gray-500" />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Shipping Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.shipping_address}
                onChange={e => setForm({ ...form, shipping_address: e.target.value })}
                className="input-field resize-none"
                rows={3}
                placeholder="Enter your full shipping address..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Note (optional)</label>
              <textarea
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                className="input-field resize-none"
                rows={2}
                placeholder="Any special instructions..."
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-5">
            <h2 className="font-bold text-gray-700 mb-3">Payment Method</h2>
            <div className="border border-shopee-500 rounded-lg px-4 py-3 bg-shopee-50 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-shopee-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Cash on Delivery</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">More payment methods coming soon.</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Placing Order...' : `Place Order · $${Number(cartTotal).toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-lg p-4">
            <h2 className="font-bold text-gray-700 mb-3">Items ({cartItems.length})</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {cartItems.map(item => {
                const imgUrl = item.product?.image
                  ? (item.product.image.startsWith('http') ? item.product.image : `/media/${item.product.image}`)
                  : PLACEHOLDER
                return (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="relative shrink-0">
                      <img src={imgUrl} onError={e => { e.target.src = PLACEHOLDER }}
                        alt={item.product?.name} className="w-12 h-12 object-cover rounded border" />
                      <span className="absolute -top-1 -right-1 bg-shopee-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 line-clamp-1">{item.product?.name}</p>
                      <p className="text-xs font-bold text-shopee-500">${Number(item.subtotal).toFixed(2)}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t mt-3 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>${Number(cartTotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span><span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t">
                <span>Total</span>
                <span className="text-shopee-500">${Number(cartTotal).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
