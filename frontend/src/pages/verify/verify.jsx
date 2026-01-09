// import { useEffect, useState, useRef } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./verify.css";

// const Verify = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const url = import.meta.env.VITE_API_URL;

//   const orderId = searchParams.get("orderId");
//   const session_id = searchParams.get("session_id"); // 🔥 IMPORTANT

//   const [status, setStatus] = useState("verifying");
//   const hasVerified = useRef(false);

//   useEffect(() => {
//     if (!orderId || !session_id || hasVerified.current) {
//       setStatus("failed");
//       return;
//     }

//     hasVerified.current = true;

//     const verifyPayment = async () => {
//       try {
//         const res = await axios.post(
//           `${url}/api/order/verify`,
//           {
//             orderId,
//             session_id,
//           },
//           {
//             headers: {
//               Authorization: "", // 🔥 do NOT send token
//             },
//           }
//         );

//         if (res.data.success) {
//           setStatus("success");
//           setTimeout(() => navigate("/myorders"), 2000);
//         } else {
//           setStatus("failed");
//         }
//       } catch (error) {
//         console.log("VERIFY ERROR:", error.response?.data || error.message);
//         setStatus("failed");
//       }
//     };

//     verifyPayment();
//   }, [orderId, session_id, url, navigate]);

//   return (
//     <div className="verify-page">
//       <div className="verify-card">
//         {status === "verifying" && (
//           <>
//             <div className="spinner"></div>
//             <h2>Verifying Payment</h2>
//             <p>Please wait while we confirm your order...</p>
//           </>
//         )}

//         {status === "success" && (
//           <>
//             <div className="icon success">✔</div>
//             <h2>Order Placed Successfully!</h2>
//             <p>You’ll be redirected shortly.</p>
//           </>
//         )}

//         {status === "failed" && (
//           <>
//             <div className="icon failed">✖</div>
//             <h2>Payment Failed</h2>
//             <button onClick={() => navigate("/")}>Go Home</button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Verify;
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;

  const orderId = params.get("orderId");
  const session_id = params.get("session_id");

  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.post(`${url}/api/order/verify`, {
          orderId,
          session_id,
        });

        if (res.data.success) {
          setStatus("success");
          setTimeout(() => navigate("/myorders"), 1500);
        } else {
          setStatus("failed");
        }
      } catch (err) {
        setStatus("failed");
      }
    };

    if (orderId && session_id) verifyPayment();
    else setStatus("failed");
  }, []);

  return (
    <h2>
      {status === "verifying" && "Verifying Payment..."}
      {status === "success" && "Payment Successful 🎉"}
      {status === "failed" && "Payment Failed ❌"}
    </h2>
  );
};

export default Verify;
