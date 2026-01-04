import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [foodList, setFoodList] = useState([]);

  const url = import.meta.env.VITE_API_URL;

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (!token) return;

    await axios.post(
      `${url}/api/cart/add`,
      { itemId },
      { headers: { token } }
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const copy = { ...prev };
      if (copy[itemId] > 1) copy[itemId]--;
      else delete copy[itemId];
      return copy;
    });
  };

  // ✅ THIS FUNCTION WAS MISSING / MISMATCHED
  const getTotalCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const item = foodList.find((f) => f._id === id);
      if (item) total += item.price * cartItems[id];
    }
    return total;
  };

  const fetchFoodList = async () => {
    const res = await axios.get(`${url}/api/food/list`);
    if (res.data.success) setFoodList(res.data.data);
  };

  useEffect(() => {
    fetchFoodList();
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        food_list: foodList,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount, // ✅ MUST BE HERE
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
