import { assets } from "../../assets/assets";
import "./Navbar.css";

const Navbar = () => {
  return (
    <>
      <div className="navbar">
        <img
          className="logo"
          src={assets.logo}
          alt="Admin Logo"
        />

        <img
          className="profile"
          src={assets.profile_image}
          alt="Admin Profile"
        />
      </div>
      <hr />
    </>
  );
};

export default Navbar;
