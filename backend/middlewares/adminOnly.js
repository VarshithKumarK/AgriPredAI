import User from "../models/User.js";

export const adminOnly = async (req, res, next) => {
  try {
   
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied . Admins Only" });
    }
    next();
  } catch (error) {
    console.log("Error in adminOnly Middleware", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
