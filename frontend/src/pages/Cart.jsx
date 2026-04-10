import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { EmptyState } from '../components/common/UI'
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'

const PLACEHOLDER = 'https://via.placeholder.com/80x80?text=?'

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeItem, loading } = useCart()
  const navigate = useNavigate()

  const handleUpdate = async (itemId, newQty) => {
    try { await updateQuantity(itemId, newQty) }
    catch { toast.error('Update failed') }
  }

  const handleRemove = async (itemId) => {
    try { await removeItem(itemId); toast.success('Item removed') }
    catch { toast.error('Remove failed') }
  }

  if (!loading && cartItems.length === 0) {
    return (
      <EmptyState
        icon={<FiShoppingCart size={64} />}
        title="Your cart is empty"
        description="Add items to your cart and they'll appear here"
        action={<Link to="/products" className="btn-primary">Start Shopping</Link>}
      />
    )
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Shopping Cart ({cartItems.length} items)</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Items */}
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="bg-white rounded-lg px-4 py-2 hidden md:grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Total</div>
          </div>

          {cartItems.map(item => {
            const imgUrl = item.product?.image
              ? (item.product.image.startsWith('http') ? item.product.image : `/media/${item.product.image}`)
              : PLACEHOLDER
            return (
              <div key={item.id} className="bg-white rounded-lg px-4 py-3 grid grid-cols-12 gap-3 items-center">
                {/* Product */}
                <div className="col-span-12 md:col-span-6 flex items-center gap-3">
                  <img src={imgUrl} onError={e => { e.target.src = PLACEHOLDER }}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded border shrink-0" />
                  <div className="min-w-0">
                    <Link to={`/products/${item.product?.id}`}
                      className="text-sm font-medium text-gray-700 hover:text-shopee-500 line-clamp-2">
                      {item.product?.name}
                    </Link>
                    <button onClick={() => handleRemove(item.id)}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 mt-1">
                      <FiTrash2 size={11} /> Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-4 md:col-span-2 text-center">
                  <p className="text-xs text-gray-400 md:hidden">Price</p>
                  <span className="text-sm text-shopee-500 font-semibold">
                    ${Number(item.product?.price).toFixed(2)}
                  </span>
                </div>

                {/* Quantity */}
                <div className="col-span-4 md:col-span-2 flex justify-center">
                  <div className="flex items-center border rounded overflow-hidden">
                    <button onClick={() => handleUpdate(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200">
                      <FiMinus size={12} />
                    </button>
                    <span className="px-3 py-1 text-sm font-semibold border-x">{item.quantity}</span>
                    <button onClick={() => handleUpdate(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200">
                      <FiPlus size={12} />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="col-span-4 md:col-span-2 text-center">
                  <p className="text-xs text-gray-400 md:hidden">Total</p>
                  <span className="text-sm font-bold text-shopee-500">
                    ${Number(item.subtotal).toFixed(2)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-lg p-4 sticky top-20">
            <h2 className="font-bold text-gray-700 text-base mb-3">Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-600 border-b pb-3 mb-3">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${Number(cartTotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-gray-800 text-base mb-4">
              <span>Total</span>
              <span className="text-shopee-500">${Number(cartTotal).toFixed(2)}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full py-3 text-base">
              Proceed to Checkout
            </button>
            <Link to="/products" className="block text-center text-sm text-shopee-500 hover:underline mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
