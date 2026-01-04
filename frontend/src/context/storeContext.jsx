import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // ✅ SINGLE SOURCE OF TRUTH
  const url = import.meta.env.VITE_BACKEND_URL;

  /* ================= FETCH FOOD LIST ================= */
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data.success) {
        setFoodList(res.data.data);
      }
    } catch (error) {
      console.error("Food list fetch error:", error);
    }
  };

  /* ================= CART ================= */
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (!token) return;

    try {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        { headers: { token } }
      );
    } catch (error) {
      console.log("Add to cart error");
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (!updated[itemId]) return updated;
      if (updated[itemId] === 1) delete updated[itemId];
      else updated[itemId]--;
      return updated;
    });
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = food_list.find((item) => item._id === id);
      if (product) total += product.price * cartItems[id];
    }
    return total;
  };

  const loadCartData = async (savedToken) => {
    if (!savedToken) return;
    try {
      const res = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token: savedToken } }
      );
      setCartItems(res.data?.cartData || {});
    } catch {
      console.log("User not logged in, cart skipped");
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    fetchFoodList();

    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      loadCartData(savedToken);
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{
        food_list,
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
