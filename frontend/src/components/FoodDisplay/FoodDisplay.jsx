import React, { useContext, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/storeContext";
import FoodItem from "../FoodItem/FoodItem";
import { assets } from "../../assets/assets";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [search, setSearch] = useState("");

  const filteredFood = food_list.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="food-display">
      
      <h2>🔥 Top dishes near you</h2>
      
      {/* 🔍 SEARCH CARD */}
      <div className="search-card" id="food-search">
        <div className="search-box">
          <img src={assets.search_icon} alt="search" />
          <input
            type="text"
            placeholder="Search for food, dishes, flavours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <span className="clear-btn" onClick={() => setSearch("")}>
              ✕
            </span>
          )}
        </div>
       
        {/* QUICK FILTERS
        <div className="quick-filters">
          {["Pizza", "Burger", "Biryani", "Salad", "Dessert"].map((item) => (
            <span
              key={item}
              onClick={() => setSearch(item)}
              className="filter-chip"
            >
              {item}
            </span>
          ))}
        </div> */}

        {/* POPULAR */}
        <p className="popular-text">
          Popular: <span onClick={() => setSearch("Paneer")}>Paneer</span> •
          <span onClick={() => setSearch("Chicken")}> Chicken</span> •
          <span onClick={() => setSearch("Roll")}> Rolls</span>
        </p>
      </div>

      {/* FOOD GRID */}
      <div className="food-display-list">
        {filteredFood.length > 0 ? (
          filteredFood.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p className="no-results">
            😔 No dishes found. Try something else!
          </p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
