import '../styles/cart.css'

function Cart({ cart, checkout }) {
    return (
      <div className="cart">
        <h2>Cart</h2>
  
        {cart.map((item, index) => (
          <p key={index}>
            {item.name} x {item.quantity}
          </p>
        ))}
  
        <button onClick={checkout}>Checkout</button>
      </div>
    )
  }
  
  export default Cart
  