import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Orders.css";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  // Axios instance
  const api = useMemo(() => {
    return axios.create({
      baseURL: url,
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });
  }, [url, token]);

  /* ================= FETCH ALL ORDERS ================= */
  const fetchAllOrders = async () => {
    try {
      const res = await api.get("/api/order/list");

      if (res.data?.success) {
        setOrders(res.data.data || []);
      } else {
        toast.error("Server error ❌");
      }
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);
      toast.error("Server error ❌");
    }
  };

  /* ================= UPDATE ORDER STATUS ================= */
  const statusHandler = async (orderId, status) => {
    try {
      const res = await api.post("/api/order/status", {
        orderId,
        status,
      });

      if (res.data?.success) {
        toast.success("Order status updated ✅");
        fetchAllOrders();
      } else {
        toast.error("Server error ❌");
      }
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);
      toast.error("Server error ❌");
    }
  };

  /* ================= INITIAL LOAD ================= */
useEffect(() => {
  if (!url) {
    toast.error("API URL not configured ❌");
    return;
  }

  fetchAllOrders(); // initial load

  const interval = setInterval(() => {
    fetchAllOrders();
  }, 5000); // every 5 seconds

  return () => clearInterval(interval);
}, [url]);


  return (
    <div className="order add">
      <h3>Order Page</h3>

      <div className="order-list">
        {orders.length === 0 ? (
          <p className="empty-text">No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-item">
              <img
                src={assets.parcel_icon}
                alt="Order parcel"
                className="order-icon"
              />

              <div className="order-item-details">
                <p className="order-item-food">
                  {order.items.map((item, index) => (
                    <span key={index}>
                      {item.name} × {item.quantity}
                      {index !== order.items.length - 1 && ", "}
                    </span>
                  ))}
                </p>

                <p className="order-item-name">
                  {order.address.firstname} {order.address.lastname}
                </p>

                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.country}{" "}
                    {order.address.zip}
                  </p>
                </div>

                <p className="order-item-phone">
                  {order.address.phone}
                </p>

                <p>Items: {order.items.length}</p>
                <p className="order-amount">₹{order.amount}</p>

                <select
                  value={order.status}
                  onChange={(e) =>
                    statusHandler(order._id, e.target.value)
                  }
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out For Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
