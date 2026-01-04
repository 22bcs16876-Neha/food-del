import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/storeContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // ✅ Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // ✅ Apply promo logic
  const applyPromoCode = () => {
    if (promoCode === "SAVE50") {
      setDiscount(50);
      alert("₹50 discount applied 🎉");
    } else if (promoCode === "SAVE100") {
      setDiscount(100);
      alert("₹100 discount applied 🎉");
    } else {
      alert("Invalid promo code ❌");
      setDiscount(0);
    }
  };

  // ✅ Checkout handler
  const handleCheckout = () => {
    if (getTotalCartAmount() === 0) {
      alert("Cart is empty");
      return;
    }

    if (!token) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    navigate("/order");
  };

  return (
    <div className="cart">
      {/* ---------------- CART ITEMS ---------------- */}
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <hr />

        {food_list.map((item) => {
          const quantity = cartItems[item._id];

          if (quantity > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img
                    src={`${url}/uploads/${item.image}`}
                    alt={item.name}
                  />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{quantity}</p>
                  <p>₹{item.price * quantity}</p>
                  <p
                    className="cross"
                    onClick={() => removeFromCart(item._id)}
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* ---------------- CART SUMMARY ---------------- */}
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 49}</p>
            </div>

            <div className="cart-total-details">
              <p>Discount</p>
              <p>-₹{discount}</p>
            </div>

            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹
                {getTotalCartAmount() === 0
                  ? 0
                  : Math.max(
                      getTotalCartAmount() + 49 - discount,
                      0
                    )}
              </b>
            </div>
          </div>

          <button onClick={handleCheckout}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        {/* ---------------- PROMO CODE ---------------- */}
        <div className="cart-promo-code">
          <p>If you have a promo code, enter it here</p>
          <div className="cart-promocode-input">
            <input
              type="text"
              placeholder="promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={applyPromoCode}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
