import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/product/ProductCard'
import { Spinner } from '../components/common/UI'

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', icon: '📱' },
  { name: 'Fashion',     slug: 'fashion',     icon: '👗' },
  { name: 'Home',        slug: 'home',         icon: '🏠' },
  { name: 'Beauty',      slug: 'beauty',       icon: '💄' },
  { name: 'Sports',      slug: 'sports',       icon: '⚽' },
  { name: 'Books',       slug: 'books',        icon: '📚' },
  { name: 'Toys',        slug: 'toys',         icon: '🧸' },
  { name: 'Food',        slug: 'food',         icon: '🍜' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newest, setNewest]     = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/products/featured/'),
      api.get('/products/?ordering=-created_at&page_size=20'),
    ]).then(([f, n]) => {
      setFeatured(f.data)
      setNewest(n.data.results || n.data)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-shopee-500 to-orange-400 text-white px-8 py-10 md:py-14">
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/80 mb-1">Welcome to</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
            Shopp<span className="text-yellow-300">ee</span>
          </h1>
          <p className="text-white/90 text-lg mb-5">Millions of products. Great deals every day.</p>
          <Link to="/products" className="inline-block bg-white text-shopee-500 font-bold px-6 py-2.5 rounded-full hover:bg-shopee-50 transition-colors shadow">
            Shop Now →
          </Link>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -right-2 bottom-0 w-32 h-32 bg-white/5 rounded-full" />
      </div>

      {/* Categories */}
      <section>
        <div className="bg-white rounded-lg p-4">
          <h2 className="text-base font-bold text-gray-700 mb-3">CATEGORIES</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-shopee-50 transition-colors group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs text-gray-600 group-hover:text-shopee-500 font-medium text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-white font-extrabold text-xl">🔥 Flash Sale</h2>
          <p className="text-white/80 text-sm">Limited time deals — up to 70% off!</p>
        </div>
        <Link to="/products?ordering=sold" className="bg-white text-orange-500 font-bold text-sm px-4 py-2 rounded-full hover:bg-orange-50 transition-colors">
          See All
        </Link>
      </div>

      {/* Featured Products */}
      <section>
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-shopee-500 uppercase flex items-center gap-2">
              <span className="w-1 h-5 bg-shopee-500 rounded inline-block" />
              Top Selling
            </h2>
            <Link to="/products?ordering=sold" className="text-xs text-shopee-500 hover:underline font-semibold">See All</Link>
          </div>
          {loading ? <Spinner /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {featured.slice(0, 12).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Newest */}
      <section>
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-shopee-500 uppercase flex items-center gap-2">
              <span className="w-1 h-5 bg-shopee-500 rounded inline-block" />
              New Arrivals
            </h2>
            <Link to="/products" className="text-xs text-shopee-500 hover:underline font-semibold">See All</Link>
          </div>
          {loading ? <Spinner /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {newest.slice(0, 12).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
