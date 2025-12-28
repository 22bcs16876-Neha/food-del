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

        console.log("VERIFY API RESPONSE:", res.data);

        if (res.data.success === true) {
          setStatus("success");
          setTimeout(() => navigate("/myorders"), 2000);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.log("VERIFY ERROR:", error);
        setStatus("failed");
      }
    };

    // ✅ IMPORTANT FIX
    if (orderId) {
      verifyPayment();
    }
  }, [success, orderId, navigate, url, token]);

  return (
    <div className="verify-page">
      <div className="verify-card">
        {status === "verifying" && (
          <>
            <div className="spinner"></div>
            <h2>Verifying Payment</h2>
            <p>Please wait while we confirm your order...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="icon success">✔</div>
            <h2>Order Placed Successfully!</h2>
            <p>You’ll be redirected to your orders shortly.</p>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="icon failed">✖</div>
            <h2>Payment Failed</h2>
            <p>Please try again.</p>
            <button onClick={() => navigate("/")}>Go Home</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
