import "./MyOrders.css";
import { useState, useContext, useEffect, useCallback } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH USER ORDERS ================= */
  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(
        `${url}/api/order/userorders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        setOrders(res.data.data || []);
      } else {
        setError("Failed to load orders");
      }
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [token, fetchOrders, navigate]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      <div className="container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : orders.length === 0 ? (
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

              <p className="price">₹{order.amount}</p>
              <p>Items: {order.items.length}</p>

              <p className={`status ${order.status.toLowerCase()}`}>
                ● {order.status}
              </p>

              <button
                className="track-btn"
                onClick={() => navigate(`/track/${order._id}`)}
              >
                Track Order
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
