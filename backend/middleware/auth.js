import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    // ✅ Standard Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ attach user securely
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
