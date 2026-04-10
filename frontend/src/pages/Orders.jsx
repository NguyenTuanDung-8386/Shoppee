import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { Spinner, EmptyState, Badge } from '../components/common/UI'
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import toast from 'react-hot-toast'

const PLACEHOLDER = 'https://via.placeholder.com/60x60?text=?'

export default function Orders() {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [expanded, setExpanded]   = useState(null)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    api.get('/orders/')
      .then(r => setOrders(r.data.results || r.data))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return
    setCancelling(orderId)
    try {
      await api.patch(`/orders/${orderId}/`, { status: 'cancelled' })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o))
      toast.success('Order cancelled')
    } catch {
      toast.error('Cannot cancel this order')
    } finally {
      setCancelling(null)
    }
  }

  if (loading) return <Spinner />

  if (orders.length === 0) return (
    <EmptyState
      icon={<FiPackage size={64} />}
      title="No orders yet"
      description="Your order history will appear here"
      action={<Link to="/products" className="btn-primary">Start Shopping</Link>}
    />
  )

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">My Orders</h1>

      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Order Header */}
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="text-sm font-bold text-gray-700">#{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-sm text-gray-700">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Items</p>
                  <p className="text-sm text-gray-700">{order.item_count} item(s)</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-sm font-bold text-shopee-500">${Number(order.total_price).toFixed(2)}</p>
                </div>
                <Badge status={order.status} />
              </div>
              <div className="text-gray-400 shrink-0">
                {expanded === order.id ? <FiChevronUp /> : <FiChevronDown />}
              </div>
            </div>

            {/* Expanded Detail */}
            {expanded === order.id && (
              <OrderDetail orderId={order.id} status={order.status}
                onCancel={handleCancel} cancelling={cancelling} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderDetail({ orderId, status, onCancel, cancelling }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${orderId}/`)
      .then(r => setDetail(r.data))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) return <div className="px-5 pb-4"><Spinner size={6} /></div>
  if (!detail) return null

  return (
    <div className="border-t px-5 pb-5">
      {/* Items */}
      <div className="py-4 space-y-3">
        {detail.items.map(item => {
          const imgUrl = item.product_image
            ? (item.product_image.startsWith('http') ? item.product_image : `/media/${item.product_image}`)
            : PLACEHOLDER
          return (
            <div key={item.id} className="flex items-center gap-3">
              <img src={imgUrl} onError={e => { e.target.src = PLACEHOLDER }}
                alt={item.product_name} className="w-14 h-14 object-cover rounded border shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 line-clamp-1">{item.product_name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
              </div>
              <span className="text-sm font-bold text-shopee-500 shrink-0">
                ${Number(item.subtotal).toFixed(2)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="border-t pt-4 flex items-center justify-between flex-wrap gap-3">
        <div className="text-sm text-gray-600">
          <span className="font-semibold">Ship to: </span>{detail.shipping_address}
          {detail.note && <p className="text-xs text-gray-400 mt-0.5">Note: {detail.note}</p>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-gray-700">
            Total: <span className="text-shopee-500">${Number(detail.total_price).toFixed(2)}</span>
          </span>
          {status === 'pending' && (
            <button
              onClick={() => onCancel(orderId)}
              disabled={cancelling === orderId}
              className="btn-outline text-sm border-red-400 text-red-500 hover:bg-red-50"
            >
              {cancelling === orderId ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
