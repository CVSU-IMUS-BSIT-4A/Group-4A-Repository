import { useState, useEffect } from 'react'
import ProductList from './components/ProductList'
import Cart from './components/Cart'

function App() {
  const [cart, setCart] = useState([])

  const loadCart = async () => {
    try {
      const res = await fetch('http://localhost:3000/cart')
      if (!res.ok) throw new Error('Failed to fetch cart')
      const data = await res.json()
      setCart(data)
    } catch (err) {
      console.error(err)
    }
  }

  const addToCart = async product => {
    try {
      await fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      })
      loadCart()
    } catch (err) {
      console.error(err)
    }
  }

  const checkout = async () => {
    try {
      await fetch('http://localhost:3000/orders/checkout', {
        method: 'POST',
      })
      alert('Order successful!')
      loadCart()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  return (
    <div className="container">
      <h1>Mini E-Commerce</h1>
      

      <ProductList addToCart={addToCart} />

      <Cart cart={cart} checkout={checkout} />
    </div>
  )
}

export default App
