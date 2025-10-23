import jwt from "jsonwebtoken";
export const protectRoute = async (req, res, next) => {
  const token = req.cookies.token;
 // console.log(token);

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.log("Error in authMiddleware", error.message);
    res.status(400).json({ success: false, message: "Invalid Token" });
  }
};
