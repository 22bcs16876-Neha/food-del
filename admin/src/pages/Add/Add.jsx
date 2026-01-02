import { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Add = () => {
  const url = import.meta.env.VITE_BACKEND_URL;

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });


  // input / select / textarea handler
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // submit handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image 🖼️");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("image", image);

const response = await axios.post(
  `${url}/api/food/add`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);


      if (response.data.success) {
        toast.success(response.data.message);

        // reset form
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
        });
        setImage(null);
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error("Server error ❌");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>

        {/* IMAGE UPLOAD */}
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>

          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload preview"
            />
          </label>

          <input
            id="image"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* PRODUCT NAME */}
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            type="text"
            name="name"
            placeholder="Type here"
            value={data.name}
            onChange={onChangeHandler}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="add-product-description flex-col">
          <p>Description</p>
          <textarea
            name="description"
            rows="6"
            placeholder="Write content here"
            value={data.description}
            onChange={onChangeHandler}
            required
          />
        </div>

        {/* CATEGORY & PRICE */}
        <div className="add-category-price">

          <div className="add-category flex-col">
            <p>Product category</p>
            <select
              name="category"
              value={data.category}
              onChange={onChangeHandler}
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product price</p>
            <input
              type="number"
              name="price"
              placeholder="₹20"
              value={data.price}
              onChange={onChangeHandler}
              required
            />
          </div>

        </div>

        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
