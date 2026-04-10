import { Link } from 'react-router-dom'
import { FiStar, FiShoppingCart } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const PLACEHOLDER = 'https://via.placeholder.com/300x300?text=No+Image'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to add to cart'); return }
    try {
      await addToCart(product.id, 1)
      toast.success('Added to cart!')
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  const imageUrl = product.image
    ? (product.image.startsWith('http') ? product.image : `/media/${product.image}`)
    : PLACEHOLDER

  return (
    <Link to={`/products/${product.id}`} className="card block group overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = PLACEHOLDER }}
        />
        {product.discount_percent > 0 && (
          <span className="absolute top-1.5 left-1.5 bg-shopee-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
            -{product.discount_percent}%
          </span>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 bg-shopee-500 text-white py-2 text-xs font-semibold
                     translate-y-full group-hover:translate-y-0 transition-transform duration-200
                     flex items-center justify-center gap-1"
        >
          <FiShoppingCart size={14} /> Add to Cart
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <p className="text-sm text-gray-700 font-medium line-clamp-2 leading-snug mb-1.5">{product.name}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-shopee-500 font-bold text-base">
            ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          {product.original_price && Number(product.original_price) > Number(product.price) && (
            <span className="text-gray-400 text-xs line-through">
              ${Number(product.original_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5 text-xs text-gray-400">
          <span className="flex items-center gap-0.5">
            <FiStar className="text-yellow-400 fill-yellow-400" size={11} />
            {Number(product.rating).toFixed(1)}
          </span>
          <span>{product.sold} sold</span>
        </div>
      </div>
    </Link>
  )
}
