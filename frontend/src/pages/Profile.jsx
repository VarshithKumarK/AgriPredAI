import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserAlt, FaEnvelope, FaUpload } from "react-icons/fa";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("No file selected");
    setUploading(true);
    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/update-profile-pic",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser(res.data);
      toast.success("Profile picture updated!");
      setSelectedFile(null);
      setPreview("");
    } catch (error) {
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p className="text-3xl font-semibold">Please log in to view your profile</p>
      </div>
    );
  }

  const currentPhoto = preview || user?.profilePic;
  const userRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "User";

  return (
    <div className="min-h-screen bg-gray-950 flex justify-center items-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-lime-500/20 rounded-3xl shadow-2xl p-12 text-white"
      >
        <h1 className="text-6xl font-extrabold text-lime-400 mb-16 text-center">
          Public Profile
        </h1>

        {/* Profile Picture + Upload */}
        <div className="flex flex-col items-center gap-8 mb-16">
          {currentPhoto ? (
            <img
              src={currentPhoto}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-lime-500 object-cover shadow-xl hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-800 flex items-center justify-center text-lime-400 text-6xl font-bold border-4 border-lime-500 shadow-xl">
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>
          )}

          {/* Upload Button */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <label className="cursor-pointer bg-lime-500 hover:bg-lime-600 text-gray-900 font-bold py-4 px-8 rounded-2xl shadow-md transition text-2xl">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="flex items-center gap-3">
                <FaUpload className="w-7 h-7" />
                {user?.profilePic ? "Update Photo" : "Upload Photo"}
              </span>
            </label>

            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-2xl shadow-md transition text-2xl disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Save Photo"}
              </button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="block text-2xl font-bold text-gray-300 mb-3">
              Username
            </label>
            <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl text-2xl flex items-center gap-3">
              <FaUserAlt className="w-7 h-7 text-lime-400" /> {user.username}
            </div>
          </div>

          <div>
            <label className="block text-2xl font-bold text-gray-300 mb-3">
              Account Role
            </label>
            <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl text-2xl">
              {userRole}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-2xl font-bold text-gray-300 mb-3">
              Email Address
            </label>
            <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl text-2xl flex items-center gap-3">
              <FaEnvelope className="w-7 h-7 text-lime-400" /> {user.email}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
