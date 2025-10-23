import React, { useContext, useState } from "react";
import { Link, useNavigate, BrowserRouter, useInRouterContext } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const LoginContent = () => {
  const inRouterContext = useInRouterContext();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.token) {
        // ✅ Save credentials
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ Update AuthContext
        setUser(res.data.user);

        toast.success("Login Successful!");
        navigate("/");
      } else {
        console.log("Unexpected response:", res);
        setError("Invalid response from server.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.response?.data?.message || "Login Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-12 bg-gray-950">
      {/* Background visuals */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-lime-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl"
      >
        {/* Left side - Form */}
        <div className="p-8 sm:p-12 space-y-8">
          <h2 className="text-5xl font-extrabold mb-2 text-white">Welcome Back</h2>
          <p className="text-xl text-gray-300">Sign in to access your crop detection and analysis tools.</p>

          {/* Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-300 text-base bg-red-900/50 p-3 rounded-xl border border-red-700 font-semibold"
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-2xl font-bold text-gray-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="name@example.com"
                className="w-full p-4 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-lime-400 text-xl text-white placeholder-gray-400 transition duration-300 shadow-lg"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-2xl font-bold text-gray-200 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                placeholder="••••••••"
                className="w-full p-4 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-lime-400 text-xl text-white placeholder-gray-400 transition duration-300 shadow-lg"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-lime-500 hover:bg-lime-600 text-gray-900 font-bold py-4 px-4 rounded-xl shadow-xl shadow-lime-500/40 transition duration-300 transform hover:scale-[1.01] flex items-center justify-center disabled:opacity-50 text-2xl"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0
                    c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Log in to AgriPredAI"
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-xl text-gray-400 pt-4">
            Don't have an account?{" "}
            <Link className="text-lime-400 hover:text-lime-300 font-bold transition hover:underline" to="/register">
              Create Account
            </Link>
          </p>
        </div>

        {/* Right side - Illustration */}
        <div className="hidden lg:flex items-center justify-center p-8 bg-black/10">
          <div className="text-center">
            <svg
              className="w-72 h-72 mx-auto text-lime-500/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="8 12 12 16 16 12" />
            </svg>
            <h3 className="text-3xl font-bold mt-4 text-white">AI-Powered Farming</h3>
            <p className="text-xl text-gray-400 mt-2 max-w-xs mx-auto">
              Access real-time detection, health reports, and personalized insights.
            </p>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

// ✅ Wrapper for safe preview outside Router
const Login = () => {
  const inRouterContext = useInRouterContext();
  if (!inRouterContext) {
    return (
      <BrowserRouter>
        <LoginContent />
      </BrowserRouter>
    );
  }
  return <LoginContent />;
};

export default Login;
