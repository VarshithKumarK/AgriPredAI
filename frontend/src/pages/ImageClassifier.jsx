import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Assuming you have 'toast' available globally or imported in your main App.jsx
const toast = { error: (msg) => console.log("Toast Error:", msg), success: (msg) => console.log("Toast Success:", msg) }; 

// Placeholder Icons
const UploadIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const CheckIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
const ErrorIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;

function ImageClassifier() {
    const [file, setFile] = useState(null);
    const [prediction, setPrediction] = useState("");
    const [loading, setLoading] = useState(false);
    const [cure, setCure] = useState(null); // { symptoms, cure, prevention }
    const [previewUrl, setPreviewUrl] = useState(null);
    const [predictionStatus, setPredictionStatus] = useState(null); // 'success', 'error', 'loading', null

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPrediction("");
            setCure(null);
            setPredictionStatus(null);
            // Create a local URL for image preview
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    // Cleanup object URL when component unmounts or file changes
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Functionality: Handles the API submission
    const handleSubmit = async () => {
        if (!file) return toast.error("Please select an image to classify."); // Replaced alert()
        
        setLoading(true);
        setPredictionStatus('loading');
        setPrediction("");

        const formData = new FormData();
        formData.append("image", file);

        try {
            // --- NOTE: This is your original endpoint logic ---
            const response = await fetch("http://127.0.0.1:8000/predict", {
                method: "POST",
                body: formData,
            });
            
            const data = await response.json();
            
            if (response.ok && data.prediction) {
                setPrediction(data.prediction);
                setCure(data.cure_info);
                setPredictionStatus('success');
                toast.success("Classification complete!");

                // Save to Backend Logbook
                try {
                    const saveFormData = new FormData();
                    saveFormData.append("image", file);
                    saveFormData.append("diseaseDetected", data.prediction);
                    saveFormData.append("confidenceScore", 0.95); // Mocked for now
                    saveFormData.append("plantType", "Unknown");
                    // Assuming backend can handle cureInfo in some way if we wanted to save it, 
                    // but for now we just save the basic info
                    
                    await axios.post("http://localhost:5000/api/predictions/save", saveFormData, {
                        headers: { "Content-Type": "multipart/form-data" },
                        withCredentials: true
                    });
                    toast.success("Saved to Logbook!");
                } catch (saveError) {
                    console.error("Save error:", saveError);
                    toast.error("Failed to save to logbook");
                }

            } else {
                setPrediction("Prediction unavailable or model error.");
                setCure(null);
                setPredictionStatus('error');
                toast.error(data.prediction || "Model returned an error.");
            }
            
        } catch (error) {
            console.error("Error:", error);
            setPrediction("Network connection failed.");
            setPredictionStatus('error');
            toast.error("Error connecting to model API.");
        } finally {
            setLoading(false);
        }
    };

    const getPredictionStyle = () => {
        if (predictionStatus === 'success') {
            return "bg-green-800 text-lime-400 border-lime-500";
        }
        if (predictionStatus === 'error') {
            return "bg-red-800 text-red-300 border-red-500";
        }
        return "bg-gray-800 text-gray-400 border-gray-700";
    };


    return (
        <div className="h-screen w-full bg-gray-950 overflow-y-auto flex flex-col items-center p-4 pt-24 custom-scrollbar">
            {/* Main Classifier Card (Glassmorphic) */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-lime-500/20 rounded-3xl shadow-2xl p-6 sm:p-12 text-center text-white space-y-8"
            >
                <h1 className="text-5xl font-extrabold text-lime-400 mb-2">
                    AI Crop Disease Classifier
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Upload an image of a plant leaf below for instant disease diagnosis.
                </p>

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-lime-500/50 p-8 rounded-2xl bg-gray-900/50 transition duration-300 hover:border-lime-500 space-y-4">
                    
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                        <UploadIcon className="w-12 h-12 text-lime-500 mb-2" />
                        <span className="text-lg font-semibold text-gray-200">
                            {file ? file.name : "Click to select image"}
                        </span>
                        <span className="text-sm text-gray-400">
                            (JPG, PNG, up to 5MB)
                        </span>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    {/* Image Preview */}
                    {previewUrl && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mt-6 flex justify-center"
                        >
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-48 h-48 object-cover rounded-xl border-4 border-lime-500/50 shadow-lg"
                            />
                        </motion.div>
                    )}
                </div>

                {/* Classification Button */}
                <motion.div
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !file}
                        className="w-full sm:w-auto px-10 py-4 text-2xl font-bold rounded-xl shadow-xl transition duration-300 transform flex items-center justify-center mx-auto
                                 bg-lime-500 hover:bg-lime-600 text-gray-900 shadow-lime-500/40 disabled:bg-gray-700 disabled:text-gray-400 disabled:shadow-none"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-6 w-6 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Analyzing Leaf...
                            </>
                        ) : (
                            <>
                                <CheckIcon className="w-6 h-6 mr-3" />
                                Classify Disease
                            </>
                        )}
                    </button>
                </motion.div>

                {/* Prediction Result Display */}
                {predictionStatus && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`mt-8 p-6 rounded-xl border-2 shadow-lg mx-auto max-w-3xl w-full ${getPredictionStyle()}`}
                    >
                        <h3 className="text-3xl font-extrabold mb-4 flex items-center justify-center gap-3 border-b border-lime-500/30 pb-4">
                            {predictionStatus === 'success' ? <CheckIcon /> : <ErrorIcon />}
                            Result: {prediction}
                        </h3>

                        {/* AI Cure Section */}
                        {predictionStatus === 'success' && cure && (
                            <div className="text-left space-y-6 mt-4">
                                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                    <h4 className="text-xl font-bold text-lime-400 mb-2">🔍 Symptoms</h4>
                                    <p className="text-gray-300">{cure.symptoms || "Analyzing symptoms..."}</p>
                                </div>

                                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                    <h4 className="text-xl font-bold text-lime-400 mb-2">💊 Cure & Treatment</h4>
                                    <p className="text-gray-300 whitespace-pre-wrap">{cure.cure || "Check back for treatment options."}</p>
                                </div>

                                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                    <h4 className="text-xl font-bold text-lime-400 mb-2">🛡️ Prevention</h4>
                                    <p className="text-gray-300">{cure.prevention || "Keep plants healthy."}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-gray-700">
                                    <Link to="/chat" className="flex-1 bg-lime-600 hover:bg-lime-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition text-center flex items-center justify-center gap-2">
                                        Ask AI Assistant More
                                    </Link>
                                    <Link to="/logbook" className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition text-center flex items-center justify-center gap-2">
                                        View Full Logbook
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>


        </div>
    );
}

export default ImageClassifier;
