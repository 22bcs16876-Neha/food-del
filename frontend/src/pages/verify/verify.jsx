import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";
import "./verify.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.post(
          `${url}/api/order/verify`,
          { success, orderId },
          { headers: { token } }
        );

        console.log("VERIFY RESPONSE:", res.data);

        if (res.data.success === true) {
          setStatus("success");
          setTimeout(() => {
            navigate("/myorders");
          }, 2000);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.log("Verify error:", error);
        setStatus("failed");
      }
    };

    if (token && orderId) {
      verifyPayment();
    }
  }, [success, orderId, token, navigate, url]);

  return (
    <div className="verify-page">
      {status === "verifying" && <p>Verifying payment...</p>}
      {status === "success" && <p>🎉 Order placed successfully!</p>}
      {status === "failed" && <p>❌ Payment failed</p>}
    </div>
  );
};

export default Verify;
