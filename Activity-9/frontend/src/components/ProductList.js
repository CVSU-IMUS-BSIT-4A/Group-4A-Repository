import { useEffect, useState } from 'react'
import '../styles/product.css'

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  return (
    <div className="products">
      {products.map(p => (
        <div className="card" key={p.id}>
          <h3>{p.name}</h3>
          <p>Price ₱{p.price}</p>
          <p>Stock {p.stock}</p>
          <button onClick={() => addToCart(p)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  )
}

export default ProductList
