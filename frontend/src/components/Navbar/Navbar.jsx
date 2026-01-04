import { useContext } from "react";
import { StoreContext } from "../../context/storeContext";

const Navbar = () => {
  const { getTotalCartAmount } = useContext(StoreContext);

  return (
    <div>
      <p>Total: ₹{getTotalCartAmount()}</p>
    </div>
  );
};

export default Navbar;
