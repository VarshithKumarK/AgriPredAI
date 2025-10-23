import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    const [previewUrl, setPreviewUrl] = useState(null);
    const [predictionStatus, setPredictionStatus] = useState(null); // 'success', 'error', 'loading', null

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPrediction("");
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
            const response = await fetch("http://localhost:5000/predict", {
                method: "POST",
                body: formData,
            });
            
            const data = await response.json();
            
            if (response.ok && data.prediction) {
                setPrediction(data.prediction);
                setPredictionStatus('success');
                toast.success("Classification complete!");
            } else {
                setPrediction("Prediction unavailable or model error.");
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
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 pt-20">
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
                        className={`mt-8 p-6 rounded-xl border-2 shadow-lg mx-auto max-w-lg ${getPredictionStyle()}`}
                    >
                        <h3 className="text-3xl font-extrabold mb-2 flex items-center justify-center gap-3">
                            {predictionStatus === 'success' ? <CheckIcon /> : <ErrorIcon />}
                            Result
                        </h3>
                        <p className="text-xl font-semibold break-words">
                            {prediction}
                        </p>
                    </motion.div>
                )}

            </motion.div>
        </div>
    );
}

export default ImageClassifier;
