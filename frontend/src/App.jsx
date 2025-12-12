import "./App.css";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import ImageClassifier from "./pages/ImageClassifier";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CropLogbook from "./pages/CropLogbook";
import OllamaChat from "./pages/OllamaChat";

function App() {
  return (
     <AuthProvider>
      <ToastContainer />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/predict" element={<ImageClassifier/>} />
          <Route path="/logbook" element={<CropLogbook />} />
          <Route path="/chat" element={<OllamaChat />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
