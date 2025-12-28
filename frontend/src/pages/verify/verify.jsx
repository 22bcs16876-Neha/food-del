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

        if (res.data.success) {
          setStatus("success");
          setTimeout(() => {
            navigate("/myorders");
          }, 2500);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        setStatus("failed");
      }
    };

    if (token && orderId) {
      verifyPayment();
    }
  }, [success, orderId, token, navigate, url]);

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
            <p>
              Your payment was successful.  
              You’ll be redirected to your orders shortly.
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="icon failed">✖</div>
            <h2>Payment Failed</h2>
            <p>
              Something went wrong.  
              Please try again or place a new order.
            </p>
            <button onClick={() => navigate("/")}>Go Home</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
