import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { Spinner, EmptyState, Badge } from '../components/common/UI'
import { FiPlus, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi'
import toast from 'react-hot-toast'

const PLACEHOLDER = 'https://via.placeholder.com/60x60?text=?'

export default function MyProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(null)

  const fetchProducts = () => {
    setLoading(true)
    api.get('/products/my_products/')
      .then(r => setProducts(r.data.results || r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    setDeleting(id)
    try {
      await api.delete(`/products/${id}/`)
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success('Product deleted')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">My Products</h1>
        <Link to="/my-products/new" className="btn-primary flex items-center gap-1.5 text-sm">
          <FiPlus size={15} /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={<FiPackage size={64} />}
          title="No products yet"
          description="Start selling by adding your first product"
          action={<Link to="/my-products/new" className="btn-primary">Add Product</Link>}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Sold</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => {
                const imgUrl = p.image
                  ? (p.image.startsWith('http') ? p.image : `/media/${p.image}`)
                  : PLACEHOLDER
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={imgUrl} onError={e => { e.target.src = PLACEHOLDER }}
                          alt={p.name} className="w-12 h-12 object-cover rounded border shrink-0" />
                        <div>
                          <p className="font-medium text-gray-700 line-clamp-1 max-w-48">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.category_name || 'Uncategorized'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-shopee-500">${Number(p.price).toFixed(2)}</span>
                      {p.original_price && Number(p.original_price) > Number(p.price) && (
                        <p className="text-xs text-gray-400 line-through">${Number(p.original_price).toFixed(2)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${p.stock < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{p.sold}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/my-products/${p.id}/edit`}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50">
                          <FiEdit2 size={15} />
                        </Link>
                        <button onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
