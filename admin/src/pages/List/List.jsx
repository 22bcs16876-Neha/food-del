import { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  /* ================= FETCH FOOD LIST ================= */
  const fetchList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);

      if (res.data.success) {
        setList(res.data.data);
      } else {
        toast.error("Unable to fetch food list ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while fetching food ❌");
    }
  };

  /* ================= REMOVE FOOD ================= */
  const removeFood = async (foodId) => {
    try {
      const res = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Food removed ✅");
        fetchList(); // refresh list
      } else {
        toast.error("Failed to remove food ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error ❌");
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List</p>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item) => (
          <div className="list-table-format" key={item._id}>
            <img
              src={`${url}/images/${item.image}`}
              alt={item.name}
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <p
              className="cursor"
              onClick={() => removeFood(item._id)}
            >
              ❌
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
