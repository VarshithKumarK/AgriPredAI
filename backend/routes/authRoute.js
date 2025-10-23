import express from "express";

import { protectRoute } from "../middlewares/authMiddleware.js";
import {
  getMe,
  login,
  logout,
  register,
  updateProfilePicture,
} from "../controllers/authController.js";
import upload from "../config/multer.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post(
  "/update-profile-pic",
  protectRoute,
  upload.single("profilePic"),
  updateProfilePicture
);
router.get("/me", protectRoute, getMe);
export default router;
