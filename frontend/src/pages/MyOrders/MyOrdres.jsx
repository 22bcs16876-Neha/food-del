import "./MyOrders.css";
import { useState, useContext, useEffect, useCallback } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  // 🔹 Fetch user orders
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      setOrders(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  }, [url, token]);

  // 🔹 Call API when token is available
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, fetchOrders]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      <div className="container">
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="my-orders-order">
              <img src={assets.parcel_icon} alt="parcel" />

              <p className="items">
                {order.items.map((item, i) =>
                  i === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                )}
              </p>

              <p className="price">₹{order.amount}.00</p>

              <p className="count">Items: {order.items.length}</p>

              <p className={`status ${order.status?.toLowerCase()}`}>
                ● {order.status || "Delivered"}
              </p>

              <button className="track-btn">Track Order</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
