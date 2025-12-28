import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [foodList, setFoodList] = useState([]);

  // ✅ Backend base URL from env
  const url = import.meta.env.VITE_API_URL;

  /* ===================== ADD TO CART ===================== */
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
      console.error("Add to cart failed:", error);
    }
  };

  /* ===================== REMOVE FROM CART ===================== */
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };

      if (!updated[itemId]) return updated;

      if (updated[itemId] === 1) {
        delete updated[itemId];
      } else {
        updated[itemId]--;
      }

      return updated;
    });
  };

  /* ===================== TOTAL CART AMOUNT ===================== */
  const getTotalCartAmount = () => {
    let total = 0;

    for (const itemId in cartItems) {
      const product = foodList.find((item) => item._id === itemId);
      if (product) {
        total += product.price * cartItems[itemId];
      }
    }

    return total;
  };

  /* ===================== FETCH FOOD LIST ===================== */
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data?.data || []);
    } catch (error) {
      console.error("Fetching food list failed:", error);
    }
  };

  /* ===================== LOAD CART DATA ===================== */
const loadCartData = async (userToken) => {
  if (!userToken) return; // ✅ IMPORTANT

  try {
    const res = await axios.post(
      `${url}/api/cart/get`,
      {},
      { headers: { token: userToken } }
    );
    setCartItems(res.data?.cartData || {});
  } catch {
    console.log("User not logged in, cart skipped");
  }
};


  /* ===================== INITIAL LOAD ===================== */
useEffect(() => {
  const init = async () => {
    await fetchFoodList();

    const savedToken = localStorage.getItem("token");
    if (!savedToken) return; 

    setToken(savedToken);
    await loadCartData(savedToken);
  };

  init();
}, []);

  /* ===================== CONTEXT VALUE ===================== */
  const contextValue = {
    food_list: foodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
