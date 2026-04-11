import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiPackage, FiLogOut, FiSettings } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`)
  }

  const handleLogout = () => {
    logout()
    setDropOpen(false)
    navigate('/')
  }

  return (
    <header className="bg-shopee-500 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center gap-3 py-3">
          {/* Logo */}
          <Link to="/" className="text-white font-extrabold text-2xl tracking-tight shrink-0">
            Shopp<span className="text-yellow-300">ee</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 text-sm rounded-l outline-none"
            />
            <button type="submit" className="bg-shopee-600 hover:bg-shopee-700 text-white px-4 py-2 rounded-r transition-colors">
              <FiSearch size={18} />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Cart */}
            <Link to="/cart" className="relative text-white p-2 hover:bg-white/10 rounded transition-colors">
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-shopee-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-1.5 text-white hover:bg-white/10 px-2 py-1.5 rounded transition-colors"
                >
                  <FiUser size={20} />
                  <span className="text-sm font-semibold hidden sm:block max-w-24 truncate">{user.username}</span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded shadow-lg w-44 py-1 z-50">
                    <Link to="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FiSettings size={14} /> Profile
                    </Link>
                    <Link to="/orders" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FiPackage size={14} /> My Orders
                    </Link>
                    <Link to="/my-products" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FiPackage size={14} /> My Products
                    </Link>
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link to="/login" className="text-white text-sm font-semibold hover:bg-white/10 px-3 py-1.5 rounded transition-colors">Login</Link>
                <span className="text-white/50">|</span>
                <Link to="/register" className="text-white text-sm font-semibold hover:bg-white/10 px-3 py-1.5 rounded transition-colors">Register</Link>
              </div>
            )}
          </div>
        </div>

        {/* Category nav */}
        <nav className="flex gap-4 pb-2 overflow-x-auto text-white/90 text-xs font-medium">
          {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books', 'Toys', 'Food'].map(cat => (
            <Link key={cat} to={`/products?category=${cat.toLowerCase()}`}
              className="hover:text-white whitespace-nowrap hover:underline transition-colors">
              {cat}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
