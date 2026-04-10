import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Spinner, Badge } from '../components/common/UI'
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi'
import toast from 'react-hot-toast'

const PLACEHOLDER = 'https://via.placeholder.com/500x500?text=No+Image'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [qty, setQty]           = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [adding, setAdding]     = useState(false)
  const [review, setReview]     = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get(`/products/${id}/`)
      .then(r => setProduct(r.data))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); return }
    setAdding(true)
    try {
      await addToCart(product.id, qty)
      toast.success(`${qty} item(s) added to cart!`)
    } catch { toast.error('Failed to add to cart') }
    finally { setAdding(false) }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to review'); return }
    setSubmitting(true)
    try {
      await api.post(`/products/${id}/review/`, review)
      toast.success('Review submitted!')
      const r = await api.get(`/products/${id}/`)
      setProduct(r.data)
      setReview({ rating: 5, comment: '' })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit review')
    } finally { setSubmitting(false) }
  }

  if (loading) return <Spinner />
  if (!product) return <div className="text-center py-16 text-gray-500">Product not found.</div>

  const images = [product.image, ...(product.images?.map(i => i.image) || [])].filter(Boolean)
  const activeImageUrl = images[activeImg]
    ? (images[activeImg].startsWith('http') ? images[activeImg] : `/media/${images[activeImg]}`)
    : PLACEHOLDER

  return (
    <div>
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-shopee-500 mb-4">
        <FiArrowLeft size={14} /> Back to products
      </Link>

      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Images */}
          <div className="md:w-96 shrink-0">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
              <img src={activeImageUrl} alt={product.name}
                onError={e => { e.target.src = PLACEHOLDER }}
                className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => {
                  const url = img.startsWith('http') ? img : `/media/${img}`
                  return (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-14 h-14 rounded border-2 overflow-hidden shrink-0 ${i === activeImg ? 'border-shopee-500' : 'border-transparent'}`}>
                      <img src={url} onError={e => { e.target.src = PLACEHOLDER }}
                        alt="" className="w-full h-full object-cover" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <FiStar className="text-yellow-400 fill-yellow-400" />
                <strong className="text-gray-700">{Number(product.rating).toFixed(1)}</strong>
                <span>({product.review_count} reviews)</span>
              </span>
              <span>{product.sold} sold</span>
              <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-extrabold text-shopee-500">
                  ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                {product.original_price && Number(product.original_price) > Number(product.price) && <>
                  <span className="text-gray-400 line-through text-lg">
                    ${Number(product.original_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="bg-shopee-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    -{product.discount_percent}%
                  </span>
                </>}
              </div>
            </div>

            {product.description && (
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-600 mb-1">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm font-semibold text-gray-600">Quantity:</span>
              <div className="flex items-center border rounded overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors">
                  <FiMinus size={14} />
                </button>
                <span className="px-5 py-1.5 font-semibold text-sm border-x">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={qty >= product.stock}>
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            <button onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="btn-primary px-8 py-3 flex items-center gap-2 text-base">
              <FiShoppingCart size={18} />
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>

            <div className="mt-4 text-xs text-gray-400">
              Sold by: <span className="font-semibold text-gray-600">{product.seller?.username}</span>
              {product.category && <> · Category: <span className="font-semibold text-gray-600">{product.category.name}</span></>}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-lg shadow-sm mt-4 p-6">
        <h2 className="text-base font-bold text-gray-700 mb-4">Reviews ({product.review_count})</h2>

        {user && (
          <form onSubmit={handleReview} className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Write a Review</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600">Rating:</span>
              {[1,2,3,4,5].map(s => (
                <button type="button" key={s} onClick={() => setReview({ ...review, rating: s })}>
                  <FiStar size={20}
                    className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
            </div>
            <textarea
              value={review.comment}
              onChange={e => setReview({ ...review, comment: e.target.value })}
              className="input-field text-sm resize-none"
              rows={3} placeholder="Share your experience..." />
            <button type="submit" disabled={submitting} className="btn-primary mt-2 text-sm px-5">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {product.reviews?.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {product.reviews?.map(rev => (
              <div key={rev.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-shopee-500 text-white text-xs flex items-center justify-center font-bold">
                    {rev.user?.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{rev.user?.username}</span>
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <FiStar key={s} size={12}
                        className={s <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>
                {rev.comment && <p className="text-sm text-gray-600 ml-9">{rev.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
