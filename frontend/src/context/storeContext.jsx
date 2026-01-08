import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [foodList, setFoodList] = useState([]);

  const url = import.meta.env.VITE_API_URL;

  /* ================= ADD TO CART ================= */
  const addToCart = async (itemId) => {
    if (!token) {
      alert("Please login first");
      return;
    }

    // Optimistic UI update
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    try {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log("Add to cart error:", error);
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
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log("Remove cart error:", error);
    }
  };

  /* ================= LOAD USER CART ================= */
  const loadCartData = async (token) => {
    try {
      const res = await axios.post(
        `${url}/api/cart/get`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setCartItems(res.data.cartData);
      }
    } catch (error) {
      console.log("Cart load error:", error);
    }
  };

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
        setFoodList(res.data.data);
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

// Load token from localStorage
useEffect(() => {
  const savedToken = localStorage.getItem("token");
  if (savedToken) {
    setToken(savedToken);
  }
}, []);

// 🔥 KEEP TOKEN PERSISTENT
useEffect(() => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}, [token]);

// Load cart AFTER token is available
useEffect(() => {
  if (token) {
    loadCartData(token);
  }
}, [token]);

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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
