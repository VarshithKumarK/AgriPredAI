import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Hide Navbar on auth pages
  if (["/login", "/register"].includes(location.pathname)) return null;

  const renderAvatar = () => {
    console.log(user)
    if (user?.profilePic) {
      return (
        <img
          src={user.profilePic}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover border-2 border-lime-500 shadow-md"
        />
      );
    }
    const initial = user?.username?.[0]?.toUpperCase() || "U";
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-lime-500 text-gray-900 flex items-center justify-center text-xl font-bold border-2 border-lime-600 shadow-md">
        {initial}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-950/95 shadow-xl z-50 border-b border-lime-500/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-5 px-6">
        {/* Logo */}
        <Link to="/" className="text-4xl font-extrabold text-white tracking-tight">
          AgriPred<span className="text-lime-500">AI</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex gap-12 items-center">
          <li>
            <Link
              to="/predict"
              className="relative text-2xl font-semibold text-gray-300 hover:text-lime-400 transition group"
            >
              Predict Diseases
              <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-[3px] bg-lime-500 transition-all duration-300"></span>
            </Link>
          </li>
          <li>
            <Link
              to="/logbook"
              className="relative text-2xl font-semibold text-gray-300 hover:text-lime-400 transition group"
            >
              Logbook
              <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-[3px] bg-lime-500 transition-all duration-300"></span>
            </Link>
          </li>
          <li>
            <Link
              to="/chat"
              className="relative text-2xl font-semibold text-gray-300 hover:text-lime-400 transition group"
            >
              AI Chat
              <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-[3px] bg-lime-500 transition-all duration-300"></span>
            </Link>
          </li>

          {user && (
            <>
              <li>
                <Link
                  to="/profile"
                  className="relative text-2xl font-semibold text-gray-300 hover:text-lime-400 transition group flex items-center gap-3"
                >
                  {renderAvatar()}
                  Profile
                  <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-[3px] bg-lime-500 transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="relative text-2xl font-semibold text-gray-300 hover:text-lime-400 transition group"
                >
                  Logout
                  <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-[3px] bg-lime-500 transition-all duration-300"></span>
                </button>
              </li>
            </>
          )}

          {!user && (
            <>
              <li>
                <Link
                  to="/login"
                  className="relative text-2xl font-semibold text-gray-300 hover:text-lime-400 transition group"
                >
                  Login
                  <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-[3px] bg-lime-500 transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="relative text-2xl font-semibold text-gray-300 hover:text-lime-400 transition group"
                >
                  Register
                  <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-[3px] bg-lime-500 transition-all duration-300"></span>
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-3xl lg:hidden"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: menuOpen ? "0%" : "-100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed top-0 left-0 w-full h-screen bg-gray-900/95 flex flex-col items-center justify-center text-3xl gap-10 font-semibold text-gray-200 lg:hidden"
      >
        <Link
          to="/predict"
          onClick={() => setMenuOpen(false)}
          className="hover:text-lime-400 transition"
        >
          Predict Diseases
        </Link>
        <Link
          to="/logbook"
          onClick={() => setMenuOpen(false)}
          className="hover:text-lime-400 transition"
        >
          Logbook
        </Link>
        <Link
          to="/chat"
          onClick={() => setMenuOpen(false)}
          className="hover:text-lime-400 transition"
        >
          AI Chat
        </Link>

        {user ? (
          <>
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="hover:text-lime-400 transition"
            >
              Profile
            </Link>
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="hover:text-lime-400 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="hover:text-lime-400 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="hover:text-lime-400 transition"
            >
              Register
            </Link>
          </>
        )}
      </motion.div>
    </nav>
  );
};

export default Navbar;
