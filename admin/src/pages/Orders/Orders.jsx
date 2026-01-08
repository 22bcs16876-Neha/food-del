import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Orders.css";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken"); // 🔥 FIX
  const [orders, setOrders] = useState([]);

  const api = useMemo(() => {
    if (!BACKEND_URL || !token) return null;
    return axios.create({
      baseURL: BACKEND_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [BACKEND_URL, token]);

  const fetchOrders = async () => {
    if (!api) {
      toast.error("Admin not authenticated ❌");
      return;
    }
    try {
      const res = await api.get("/api/order/list");
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Order fetch failed ❌");
    }
  };

  const updateStatus = async (id, status) => {
    if (!api) return;
    try {
      await api.post("/api/order/status", {
        orderId: id,
        status,
      });
      toast.success("Status updated ✅");
      fetchOrders();
    } catch {
      toast.error("Status update failed ❌");
    }
  };

  useEffect(() => {
    if (!BACKEND_URL) {
      toast.error("Backend URL missing ❌");
      return;
    }
    fetchOrders();
  }, [BACKEND_URL, api]);

  return (
    <div className="order add">
      <h3>Orders</h3>

      {orders.map((order) => (
        <div key={order._id} className="order-item">
          <img src={assets.parcel_icon} alt="" />

          <div>
            <p>
              {order.items.map(
                (i) => `${i.name} x ${i.quantity}, `
              )}
            </p>

            <p>{order.address.firstname}</p>
            <p>₹{order.amount}</p>

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(order._id, e.target.value)
              }
            >
              <option>Food Processing</option>
              <option>Out For Delivery</option>
              <option>Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
