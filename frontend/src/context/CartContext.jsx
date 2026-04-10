import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); setCartCount(0); setCartTotal(0); return }
    setLoading(true)
    try {
      const { data } = await api.get('/cart/')
      setCartItems(data.items || [])
      setCartTotal(data.total || 0)
      setCartCount(data.count || 0)
    } catch (e) {
      console.error('Cart fetch error', e)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart/', { product_id: productId, quantity })
    await fetchCart()
    return data
  }

  const updateQuantity = async (itemId, quantity) => {
    await api.put(`/cart/${itemId}/`, { quantity })
    await fetchCart()
  }

  const removeItem = async (itemId) => {
    await api.delete(`/cart/${itemId}/`)
    await fetchCart()
  }

  const clearCart = async () => {
    await api.delete('/cart/clear/')
    setCartItems([])
    setCartTotal(0)
    setCartCount(0)
  }

  return (
    <CartContext.Provider value={{
      cartItems, cartTotal, cartCount, loading,
      addToCart, updateQuantity, removeItem, clearCart, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
