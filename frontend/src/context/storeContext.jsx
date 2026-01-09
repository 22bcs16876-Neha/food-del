import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [discount, setDiscount] = useState(0); // 🌟 GLOBAL DISCOUNT

  const url = import.meta.env.VITE_API_URL;

  /* ================= AXIOS INTERCEPTOR ================= */
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const savedToken = localStorage.getItem("token");

      // ❗ Only attach token if it exists
      if (savedToken) {
        config.headers.Authorization = `Bearer ${savedToken}`;
      } else {
        delete config.headers.Authorization;
      }

      return config;
    });

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  /* ================= ADD TO CART ================= */
  const addToCart = async (itemId) => {
    if (!token) return;

    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    try {
      await axios.post(`${url}/api/cart/add`, { itemId });
    } catch (error) {
      console.log("Add to cart error:", error.response?.status);
    }
  };

  /* ================= REMOVE FROM CART ================= */
  const removeFromCart = async (itemId) => {
    if (!token) return;

    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId]--;
      else delete updated[itemId];
      return updated;
    });

    try {
      await axios.post(`${url}/api/cart/remove`, { itemId });
    } catch (error) {
      console.log("Remove cart error:", error.response?.status);
    }
  };

  /* ================= LOAD USER CART ================= */
  const loadCartData = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.post(`${url}/api/cart/get`);
      if (res.data.success) {
        setCartItems(res.data.cartData || {});
      }
    } catch (error) {
      console.log("Cart load error:", error.response?.status);
    }
  }, [token, url]);

  /* ================= TOTAL AMOUNT ================= */
  const getTotalCartAmount = () => {
    let total = 0;

    for (const id in cartItems) {
      const item = foodList.find((f) => f._id === id);
      if (item) {
        total += item.price * cartItems[id];
      }
    }

    return total;
  };

  /* ================= FOOD LIST ================= */
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data.success) {
        setFoodList(res.data.data || []);
      }
    } catch (error) {
      console.log("Food list error:", error);
    }
  };

  /* ================= EFFECTS ================= */

  // Load food list once
  useEffect(() => {
    fetchFoodList();
  }, []);

  // Load token once
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  // Persist token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      setCartItems({});
      setDiscount(0); // 🔥 reset discount on logout
    }
  }, [token]);

  // Load cart after token
  useEffect(() => {
    if (token) loadCartData();
  }, [token, loadCartData]);

  /* ================= PROVIDER ================= */
  return (
    <StoreContext.Provider
      value={{
        food_list: foodList,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        discount,        // ✅ global
        setDiscount,     // ✅ global
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
