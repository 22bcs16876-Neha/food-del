import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const navigate = useNavigate();
  const deliveryFee = 49;

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // 🔹 Redirect if not logged in or cart empty
  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id],
        });
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + deliveryFee,
    };

    try {
      const response = await axios.post(
        url + "/api/order/place",
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        alert("Order failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      {/* LEFT */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input name="firstName" value={data.firstName} onChange={onChangeHandler} placeholder="First Name" required />
          <input name="lastName" value={data.lastName} onChange={onChangeHandler} placeholder="Last Name" required />
        </div>

        <input name="email" type="email" value={data.email} onChange={onChangeHandler} placeholder="Email" required />
        <input name="street" value={data.street} onChange={onChangeHandler} placeholder="Street" required />

        <div className="multiple-fields">
          <input name="city" value={data.city} onChange={onChangeHandler} placeholder="City" required />
          <input name="state" value={data.state} onChange={onChangeHandler} placeholder="State" required />
        </div>

        <div className="multiple-fields">
          <input name="zipcode" value={data.zipcode} onChange={onChangeHandler} placeholder="Zip Code" required />
          <input name="country" value={data.country} onChange={onChangeHandler} placeholder="Country" required />
        </div>

        <input name="phone" type="tel" value={data.phone} onChange={onChangeHandler} placeholder="Phone" required />
      </div>

      {/* RIGHT */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{getTotalCartAmount() === 0 ? 0 : deliveryFee}</p>
          </div>

          <div className="cart-total-details">
            <b>Total</b>
            <b>
              ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryFee}
            </b>
          </div>

          <button type="submit" disabled={getTotalCartAmount() === 0}>
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
