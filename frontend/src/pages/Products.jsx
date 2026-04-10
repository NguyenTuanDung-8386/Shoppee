import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/product/ProductCard'
import { Spinner, EmptyState } from '../components/common/UI'
import { FiFilter, FiChevronDown } from 'react-icons/fi'

const SORT_OPTIONS = [
  { label: 'Newest',        value: '-created_at' },
  { label: 'Best Selling',  value: '-sold' },
  { label: 'Top Rated',     value: '-rating' },
  { label: 'Price: Low',    value: 'price' },
  { label: 'Price: High',   value: '-price' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const search   = searchParams.get('search')   || ''
  const category = searchParams.get('category') || ''
  const ordering = searchParams.get('ordering') || '-created_at'
  const minPrice = searchParams.get('min_price') || ''
  const maxPrice = searchParams.get('max_price') || ''

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search)   params.set('search', search)
      if (category) params.set('category', category)
      if (ordering) params.set('ordering', ordering)
      if (minPrice) params.set('min_price', minPrice)
      if (maxPrice) params.set('max_price', maxPrice)
      params.set('page', page)
      const { data } = await api.get(`/products/?${params}`)
      setProducts(data.results || data)
      setTotal(data.count || (data.results || data).length)
      setTotalPages(Math.ceil((data.count || 20) / 20))
    } finally {
      setLoading(false)
    }
  }, [search, category, ordering, minPrice, maxPrice, page])

  useEffect(() => { setPage(1) }, [search, category, ordering, minPrice, maxPrice])
  useEffect(() => { fetchProducts() }, [fetchProducts])

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    setSearchParams(p)
  }

  return (
    <div className="flex gap-4">
      {/* Sidebar Filters */}
      <aside className="hidden md:block w-48 shrink-0">
        <div className="bg-white rounded-lg p-4 sticky top-20 space-y-4">
          <h3 className="font-bold text-gray-700 flex items-center gap-1"><FiFilter size={14}/> Filter</h3>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Price Range</p>
            <input type="number" placeholder="Min" value={minPrice}
              onChange={e => setParam('min_price', e.target.value)}
              className="input-field text-xs mb-2" />
            <input type="number" placeholder="Max" value={maxPrice}
              onChange={e => setParam('max_price', e.target.value)}
              className="input-field text-xs" />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Category</p>
            {['electronics','fashion','home','beauty','sports','books','toys','food'].map(c => (
              <label key={c} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="radio" name="category" checked={category === c}
                  onChange={() => setParam('category', c)} className="accent-shopee-500" />
                <span className="text-sm capitalize text-gray-600">{c}</span>
              </label>
            ))}
            {category && (
              <button onClick={() => setParam('category', '')} className="text-xs text-shopee-500 mt-1 hover:underline">
                Clear
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Sort Bar */}
        <div className="bg-white rounded-lg px-4 py-2.5 mb-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-500">Sort by:</span>
          {SORT_OPTIONS.map(o => (
            <button key={o.value}
              onClick={() => setParam('ordering', o.value)}
              className={`text-sm px-3 py-1 rounded transition-colors ${
                ordering === o.value
                  ? 'bg-shopee-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {o.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">{total} results</span>
        </div>

        {/* Search heading */}
        {search && (
          <p className="text-sm text-gray-600 mb-3">
            Results for <strong className="text-gray-800">"{search}"</strong>
          </p>
        )}

        {/* Grid */}
        {loading ? <Spinner /> : products.length === 0 ? (
          <EmptyState title="No products found" description="Try adjusting your search or filters" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded text-sm font-semibold transition-colors ${
                  page === p ? 'bg-shopee-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
