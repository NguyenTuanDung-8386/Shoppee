import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-600">
        <div>
          <h3 className="font-bold text-shopee-500 text-lg mb-2">Shoppee</h3>
          <p className="text-xs text-gray-400">Your one-stop shopping destination. Find everything you need at great prices.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Customer Service</h4>
          <ul className="space-y-1 text-xs">
            <li><Link to="#" className="hover:text-shopee-500">Help Center</Link></li>
            <li><Link to="#" className="hover:text-shopee-500">How to Buy</Link></li>
            <li><Link to="#" className="hover:text-shopee-500">Returns & Refunds</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">About Shoppee</h4>
          <ul className="space-y-1 text-xs">
            <li><Link to="#" className="hover:text-shopee-500">About Us</Link></li>
            <li><Link to="#" className="hover:text-shopee-500">Careers</Link></li>
            <li><Link to="#" className="hover:text-shopee-500">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Follow Us</h4>
          <ul className="space-y-1 text-xs">
            <li><a href="#" className="hover:text-shopee-500">Facebook</a></li>
            <li><a href="#" className="hover:text-shopee-500">Instagram</a></li>
            <li><a href="#" className="hover:text-shopee-500">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t text-center text-xs text-gray-400 py-3">
        © 2026 Shoppee. All rights reserved.
      </div>
    </footer>
  )
}
