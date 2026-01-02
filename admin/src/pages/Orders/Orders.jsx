import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Orders.css";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  // ✅ Axios instance (clean & reusable)
  const api = useMemo(() => {
    return axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [url, token]);

  /* ================= FETCH ALL ORDERS ================= */
  const fetchAllOrders = async () => {
    try {
      const res = await api.get("/api/order/list");

      if (res.data?.success) {
        setOrders(res.data.data || []);
      } else {
        toast.error("Unable to fetch orders ❌");
      }
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);
      toast.error("Unauthorized / Server error ❌");
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
        toast.error("Failed to update status ❌");
      }
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);
      toast.error("Unauthorized / Server error ❌");
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (!url) {
      toast.error("API URL not configured ❌");
      return;
    }

    if (!token) {
      toast.error("Admin not logged in ❌");
      return;
    }

    fetchAllOrders();
  }, [url, token]); // ✅ correct deps

  return (
    <div className="order add">
      <h3>Order Page</h3>

      <div className="order-list">
        {orders.length === 0 ? (
          <p className="empty-text">No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-item">
              {/* PARCEL ICON */}
              <img
                src={assets.parcel_icon}
                alt="Order parcel"
                className="order-icon"
              />

              <div className="order-item-details">
                {/* FOOD ITEMS */}
                <p className="order-item-food">
                  {order.items.map((item, index) => (
                    <span key={index}>
                      {item.name} × {item.quantity}
                      {index !== order.items.length - 1 && ", "}
                    </span>
                  ))}
                </p>

                {/* CUSTOMER NAME */}
                <p className="order-item-name">
                  {order.address.firstname} {order.address.lastname}
                </p>

                {/* ADDRESS */}
                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.country}{" "}
                    {order.address.zip}
                  </p>
                </div>

                {/* PHONE */}
                <p className="order-item-phone">
                  {order.address.phone}
                </p>

                {/* META INFO */}
                <p>Items: {order.items.length}</p>
                <p className="order-amount">₹{order.amount}</p>

                {/* STATUS DROPDOWN */}
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
