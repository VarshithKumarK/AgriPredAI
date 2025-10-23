import React, { useState } from "react";
import { Link, useNavigate, BrowserRouter, useInRouterContext } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

// Mock imports for isolated viewing (replace with real imports in your project)
const toast = { success: (msg) => console.log("Toast Success:", msg), error: (msg) => console.log("Toast Error:", msg) };
// End Mock imports

const RegisterContent = () => {
    const inRouterContext = useInRouterContext();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "user",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // --- IMPORTANT: Replace with actual Firebase or secure endpoint logic ---
        if (!inRouterContext) {
            setTimeout(() => {
                setLoading(false);
                toast.success("Mock Registered Successfully");
                navigate("/login");
            }, 1500);
            return;
        }
        // --- END Mock Logic ---

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                formData,
                { withCredentials: true }
            );
            if (response.status === 201) {
                toast.success("Registered Successfully");
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Glassmorphic background using the home page's dark colors with blur effects
        <div className="min-h-screen flex items-center justify-center p-4 lg:p-12 bg-gray-950">
            {/* Background elements for visual flair */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-lime-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Register Card: Two-Column Structure */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl"
            >
                {/* Left Side: Register Form (Made scrollable for potentially more fields on mobile) */}
                <div className="p-8 sm:p-12 space-y-8 max-h-screen lg:max-h-full overflow-y-auto">
                    <h2 className="text-5xl font-extrabold mb-2 text-white">
                        Create Account
                    </h2>
                    <p className="text-xl text-gray-300">
                        Join AgriPredAI and start optimizing your farm today.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Username Input */}
                        <div>
                            <label className="block text-2xl font-bold text-gray-200 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Farmer Name"
                                className="w-full p-4 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-lime-400 text-xl text-white placeholder-gray-400 transition duration-300 shadow-lg"
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-2xl font-bold text-gray-200 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="farmer@example.com"
                                className="w-full p-4 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-lime-400 text-xl text-white placeholder-gray-400 transition duration-300 shadow-lg"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-2xl font-bold text-gray-200 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                className="w-full p-4 rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-lime-400 text-xl text-white placeholder-gray-400 transition duration-300 shadow-lg"
                                required
                            />
                        </div>

                        {/* Role Select */}
                        <div>
                            <label className="block text-2xl font-bold text-gray-200 mb-2">
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full p-4 appearance-none rounded-xl bg-white/10 border border-white/30 focus:outline-none focus:ring-2 focus:ring-lime-400 text-xl text-white transition duration-300 shadow-lg"
                            >
                                <option value="user" className="bg-gray-800 text-white">Farmer</option>
                                <option value="admin" className="bg-gray-800 text-white">Admin</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-lime-500 hover:bg-lime-600 text-gray-900 font-bold py-4 px-4 rounded-xl shadow-xl shadow-lime-500/40 transition duration-300 transform hover:scale-[1.01] flex items-center justify-center disabled:opacity-50 text-2xl"
                        >
                            {loading ? (
                                <svg className="animate-spin h-6 w-6 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                "Register Account"
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-xl text-gray-400 pt-4">
                        Already have an account?{" "}
                        <Link className="text-lime-400 hover:text-lime-300 font-bold transition hover:underline" to="/login">
                            Log in here
                        </Link>
                    </p>
                </div>

                {/* Right Side: Illustration/Visual Element */}
                <div className="hidden lg:flex items-center justify-center p-8 bg-black/10">
                    <div className="text-center">
                        {/* Placeholder for a large, modern illustration or SVG */}
                        <svg className="w-72 h-72 mx-auto text-lime-500/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="4"/></svg>
                        <h3 className="text-3xl font-bold mt-4 text-white">Secure Registration</h3>
                        <p className="text-xl text-gray-400 mt-2 max-w-xs mx-auto">Your details are protected. Start analyzing your crops instantly.</p>
                    </div>
                </div>
            </motion.div>

            {/* Custom CSS for Glassmorphism/Animations */}
            <style>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

// Wrapper for safe isolation viewing
const Register = () => {
    const inRouterContext = useInRouterContext();
    
    if (!inRouterContext) {
        return (
            <BrowserRouter>
                <RegisterContent />
            </BrowserRouter>
        );
    }
    
    return <RegisterContent />;
};

export default Register;
