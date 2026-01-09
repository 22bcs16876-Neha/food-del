import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/storeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    discount,
    setDiscount,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");

  /* ================= APPLY PROMO ================= */
  const applyPromoCode = () => {
    const subtotal = getTotalCartAmount();
    if (subtotal === 0) {
      toast.warning("Your cart is empty 🛒");
      return;
    }

    const code = promoCode.trim().toUpperCase();

    if (code === "SAVE50") {
      setDiscount(50);
      toast.success("₹50 discount applied 🎉");
    } else if (code === "SAVE100") {
      setDiscount(100);
      toast.success("₹100 discount applied 🎉");
    } else {
      setDiscount(0);
      toast.error("Invalid promo code ❌");
    }
  };

  /* ================= CHECKOUT ================= */
  const handleCheckout = () => {
    if (getTotalCartAmount() === 0) {
      toast.warning("Your cart is empty 🛒");
      return;
    }

    if (!token) {
      toast.info("Please login to continue 🔐");
      navigate("/login");
      return;
    }

    navigate("/order");
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 49;
  const total = Math.max(subtotal + deliveryFee - Number(discount), 0);

  return (
    <div className="cart">
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
                  <img src={`${url}/uploads/${item.image}`} alt={item.name} />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{quantity}</p>
                  <p>₹{item.price * quantity}</p>
                  <p className="cross" onClick={() => removeFromCart(item._id)}>
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

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{subtotal}</p>
          </div>

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{deliveryFee}</p>
          </div>

          <div className="cart-total-details">
            <p>Discount</p>
            <p>-₹{discount}</p>
          </div>

          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{total}</b>
          </div>

          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-promo-code">
          <p>If you have a promo code, enter it here</p>
          <div className="cart-promocode-input">
            <input
              type="text"
              placeholder="Promo code"
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
