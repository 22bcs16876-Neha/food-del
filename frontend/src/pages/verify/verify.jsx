import { useContext, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";
import "./verify.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext); // ✅ token added

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.post(
          `${url}/api/order/verify`,
          { success, orderId },
          { headers: { token } } // ✅ IMPORTANT
        );

        if (res.data.success) {
          navigate("/myorders"); // ✅ correct route
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log("Verify error:", error);
        navigate("/");
      }
    };

    if (token && orderId) {
      verifyPayment();
    }
  }, [success, orderId, token, navigate, url]);

  return (
    <div className="verify">
      <div className="spinner"></div>
      <p>Verifying payment, please wait...</p>
    </div>
  );
};

export default Verify;
