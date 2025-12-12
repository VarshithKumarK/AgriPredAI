import mongoose from "mongoose";

const predictionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  
    diseaseDetected: {
      type: String,
      required: true,
    },
    confidenceScore: {
      type: Number, // Store as 0.95 etc.
      default: 0.0,
    },
    location: {
      lat: Number,
      lng: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Prediction = mongoose.model("Prediction", predictionSchema);
export default Prediction;
