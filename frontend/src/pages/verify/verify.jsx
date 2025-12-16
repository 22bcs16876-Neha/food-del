import { useContext, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";
import "./verify.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const res = await axios.post(url + "/api/order/verify", {
          success,
          orderId,
        });

        if (res.data.success) {
          navigate("/orders");
        } else {
          navigate("/");
        }
      } catch {
        navigate("/");
      }
    };

    verifyPayment();
  }, [success, orderId, navigate, url]);

  return (
    <div className="verify">
      <div className="spinner"></div>
      <p>Verifying payment, please wait...</p>
    </div>
  );
};

export default Verify;
