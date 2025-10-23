// upload.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "music";
    let resource_type = "auto";

    if (file.fieldname === "profilePic") {
      folder = "profile-pics";
      resource_type = "image";
    }

    return {
      folder,
      resource_type,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

export const uploadFields = upload.fields([
  { name: "profilePic", maxCount: 1 }, 
]);


export default upload;

