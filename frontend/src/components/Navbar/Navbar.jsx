import React, { useState, useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/storeContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src={assets.logo} alt="logo" />
      </Link>

      <ul className="navbar-menu">
        <li className={menu === "home" ? "active" : ""}>
          <Link to="/" onClick={() => setMenu("home")}>
            Home
          </Link>
        </li>

        <li className={menu === "menu" ? "active" : ""}>
          <a href="#explore-menu" onClick={() => setMenu("menu")}>
            Menu
          </a>
        </li>

        <li className={menu === "mobile-app" ? "active" : ""}>
          <a href="#app-download" onClick={() => setMenu("mobile-app")}>
            Mobile-App
          </a>
        </li>

        <li className={menu === "contact-us" ? "active" : ""}>
          <a href="#footer" onClick={() => setMenu("contact-us")}>
            Contact Us
          </a>
        </li>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="search" />

        <div className="navbar-search-icon">
          <Link to="/cart" onClick={() => setMenu("cart")}>
            <img src={assets.basket_icon} alt="basket" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button
            onClick={() => setShowLogin(true)}
            className="navbar-button"
          >
            Sign In
          </button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="profile" />
            
<ul className="nav-profile-dropdown">
  <li onClick={() => navigate("/myorders")}>
    <img src={assets.bag_icon} alt="orders" />
    <p>Orders</p>
  </li>
  <hr />
  <li onClick={logout}>
    <img src={assets.logout_icon} alt="logout" />
    <p>Logout</p>
  </li>
</ul>

          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
