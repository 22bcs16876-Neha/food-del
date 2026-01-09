useEffect(() => {
  if (!orderId || !session_id || hasVerified.current) {
    setStatus("failed");
    return;
  }

  hasVerified.current = true;

  const verifyPayment = async () => {
    try {
      const res = await axios.post(
        `${url}/api/order/verify`,
        { orderId, session_id } // 🔥 ONLY THIS
      );

      if (res.data.success) {
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

  verifyPayment();
}, []);
