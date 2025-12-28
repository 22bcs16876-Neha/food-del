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
  // verifying | success | failed

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

          // ⏳ user ko success dikhao, phir redirect
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
    <div className="verify">
      {status === "verifying" && (
        <>
          <div className="spinner"></div>
          <p>Verifying payment, please wait...</p>
        </>
      )}

      {status === "success" && (
        <>
          <h2>🎉 Order Placed Successfully!</h2>
          <p>You will be redirected to your orders shortly.</p>
        </>
      )}

      {status === "failed" && (
        <>
          <h2>❌ Payment Failed</h2>
          <button onClick={() => navigate("/")}>Go Home</button>
        </>
      )}
    </div>
  );
};

export default Verify;
