import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = () => {
  // ✅ Backend URL from ENV
  const url = import.meta.env.VITE_API_URL;

  const [orders, setOrders] = useState([]);

  /* ================= FETCH ALL ORDERS ================= */
  const fetchAllOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/order/list`);

      if (res.data.success) {
        setOrders(res.data.data);
      } else {
        toast.error("Unable to fetch orders ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while fetching orders ❌");
    }
  };

  /* ================= UPDATE STATUS ================= */
  const statusHandler = async (e, orderId) => {
    try {
      const res = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: e.target.value,
      });

      if (res.data.success) {
        toast.success("Order status updated ✅");
        fetchAllOrders();
      } else {
        toast.error("Failed to update status ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error ❌");
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>

      <div className="order-list">
        {orders.map((order) => (
          <div key={order._id} className="order-item">

            <img src={assets.parcel_icon} alt="parcel" />

            <div className="order-item-details">

              {/* FOOD ITEMS */}
              <p className="order-item-food">
                {order.items.map((item, i) =>
                  i === order.items.length - 1
                    ? `${item.name} × ${item.quantity}`
                    : `${item.name} × ${item.quantity}, `
                )}
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

              {/* META */}
              <p>Items: {order.items.length}</p>
              <p>₹{order.amount}</p>

              {/* STATUS */}
              <select
                value={order.status}
                onChange={(e) => statusHandler(e, order._id)}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
