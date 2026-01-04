import { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/storeContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { getTotalCartAmount, cartItems } = useContext(StoreContext);

  const cartCount = Object.values(cartItems).reduce(
    (sum, qty) => sum + qty,
    0
  );

  return (
    <div className="navbar">
      {/* LOGO */}
      <Link to="/">
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>

      {/* MENU */}
      <ul className="navbar-menu">
        <li>Home</li>
        <li>Menu</li>
        <li>Contact</li>
      </ul>

      {/* RIGHT SIDE */}
      <div className="navbar-right">
        <p className="navbar-total">₹{getTotalCartAmount()}</p>

        <Link to="/cart" className="navbar-cart">
          <img src={assets.basket_icon} alt="cart" />
          {cartCount > 0 && <span className="dot"></span>}
        </Link>

        <button>Sign In</button>
      </div>
    </div>
  );
};

export default Navbar;
