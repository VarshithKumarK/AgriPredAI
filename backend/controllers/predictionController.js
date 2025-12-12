import Prediction from "../models/Prediction.js";
import cloudinary from "../cloudinary.js";
import fs from "fs";

// Save a new prediction
export const savePrediction = async (req, res) => {
  try {
    const { diseaseDetected, confidenceScore, plantType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Upload image to Cloudinary
    // If using multer-storage-cloudinary, req.file.path is already the cloudinary URL
    // If using simple multer + cloudinary.uploader.upload, we need to do it manually.
    // Based on package.json having 'multer-storage-cloudinary', I'll assume we might want to use that
    // BUT common pattern is often just simple multer to disk/memory then upload.
    // I'll stick to a safe manual upload pattern if I'm not sure about the middleware setup,
    // OR just use the file path if the user configured storage.
    // Let's assume naive approach: upload from local path (if standard multer)

    let imageUrl = "";

    if (req.file.path) {
      // If using multer-storage-cloudinary, path IS the url.
      // If using dest='uploads/', it's a local path.
      // Let's check if it starts with http
      if (req.file.path.startsWith("http")) {
        imageUrl = req.file.path;
      } else {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "crop_predictions",
        });
        imageUrl = result.secure_url;
        // Clean up local file if needed
        // fs.unlinkSync(req.file.path);
      }
    }

    const newPrediction = new Prediction({
      user: req.user.id, // Fixed: user ID is in req.user.id, not req.user._id
      imageUrl,
      diseaseDetected,
      confidenceScore: confidenceScore || 0,
      plantType: plantType || "Unknown",
    });

    const savedPrediction = await newPrediction.save();
    res.status(201).json(savedPrediction);
  } catch (error) {
    console.error("Error saving prediction:", error);
    res.status(500).json({
      message: "Server Error saving prediction",
      error: error.message,
    });
  }
};

// Get prediction history for the user
export const getPredictionHistory = async (req, res) => {
  try {
    const history = await Prediction.find({ user: req.user.id }).sort({
      createdAt: -1,
    }); // Newest first
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Server Error fetching history" });
  }
};
