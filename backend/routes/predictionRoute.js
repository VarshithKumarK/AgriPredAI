import express from "express";
import {
  savePrediction,
  getPredictionHistory,
} from "../controllers/predictionController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary.js";

const router = express.Router();

// Setup Multer with Cloudinary Storage for direct upload
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "crop_app_uploads",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

// Routes
// POST /api/predictions/save - Protected, expects 'image' file
router.post("/save", protectRoute, upload.single("image"), savePrediction);

// GET /api/predictions/history - Protected
router.get("/history", protectRoute, getPredictionHistory);

export default router;
