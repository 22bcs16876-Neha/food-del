import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Add.css";
import { assets } from "../../assets/assets";

const Add = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!BACKEND_URL) {
      toast.error("Backend URL missing ❌");
      return;
    }

    if (!image) {
      toast.error("Please upload image ❌");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      );
      formData.append("image", image);

      const res = await axios.post(
        `${BACKEND_URL}/api/food/add`,
        formData
      );

      if (res.data.success) {
        toast.success("Food added ✅");
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
        });
        setImage(null);
      } else {
        toast.error("Failed to add food ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error ❌");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            type="file"
            id="image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <input
          name="name"
          placeholder="Product name"
          value={data.name}
          onChange={onChangeHandler}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={data.description}
          onChange={onChangeHandler}
        />

        <select
          name="category"
          value={data.category}
          onChange={onChangeHandler}
        >
          <option value="Salad">Salad</option>
          <option value="Rolls">Rolls</option>
          <option value="Cake">Cake</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={data.price}
          onChange={onChangeHandler}
        />

        <button className="add-btn">ADD</button>
      </form>
    </div>
  );
};

export default Add;
