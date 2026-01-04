import { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [list, setList] = useState([]);

  const fetchList = async () => {
    if (!BACKEND_URL) return;

    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/food/list`
      );
      if (res.data.success) {
        setList(res.data.data);
      }
    } catch {
      toast.error("Unable to fetch food list ❌");
    }
  };

  const removeFood = async (id) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/food/remove`,
        { id }
      );
      toast.success("Food removed ✅");
      fetchList();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  useEffect(() => {
    if (!BACKEND_URL) {
      toast.error("Backend URL missing ❌");
      return;
    }
    fetchList();
  }, [BACKEND_URL]);

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
  <div key={item._id} className="list-table-format">
    <img
      src={`${BACKEND_URL}/uploads/${item.image}`}
      alt={item.name}
      width="50"
    />
    <p>{item.name}</p>
    <p>{item.category}</p>
    <p>₹{item.price}</p>
    <p onClick={() => removeFood(item._id)}>❌</p>
  </div>
))}

      </div>
    </div>
  );
};

export default List;
