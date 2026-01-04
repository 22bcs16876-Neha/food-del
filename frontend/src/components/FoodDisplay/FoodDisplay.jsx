import React from "react";
import "./FoodDisplay.css"


const FoodItem = ({ id, name, description, price, image }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          src={`${backendUrl}/uploads/${image}`}
          alt={name}
          className="food-item-image"
        />
      </div>

      <div className="food-item-info">
        <p className="food-item-name">{name}</p>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
