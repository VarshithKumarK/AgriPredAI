import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const CropLogbook = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/predictions/history", {
                withCredentials: true 
            });
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-950 overflow-y-auto flex flex-col items-center p-4 pt-24 custom-scrollbar">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-6xl space-y-8"
            >
                <div className="text-center">
                    <h1 className="text-5xl font-extrabold text-lime-400 mb-2">
                        My Crop Logbook
                    </h1>
                    <p className="text-xl text-gray-400">
                        History of your disease diagnoses and scans.
                    </p>
                </div>

                {loading ? (
                     <div className="text-center text-gray-500 py-10">Loading history...</div>
                ) : history.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 text-xl border-2 border-dashed border-gray-800 rounded-2xl">
                        No scans yet. Go to "Predict Diseases" to add one.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {history.map((record) => (
                            <motion.div 
                                key={record._id} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gray-900/60 p-5 rounded-3xl border border-gray-800 hover:border-lime-500/50 transition duration-300 flex flex-col shadow-lg overflow-hidden group"
                            >
                                <div className="h-48 w-full mb-5 overflow-hidden rounded-2xl relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-300 z-10" />
                                    <img 
                                        src={record.imageUrl} 
                                        alt="Crop Scan" 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" 
                                    />
                                </div>
                                
                                <h4 className="text-2xl font-bold text-gray-200 mb-2">{record.diseaseDetected}</h4>
                                
                                <div className="mt-auto space-y-2">
                                    <div className="flex justify-between items-center text-sm text-gray-400">
                                        <span className="font-medium text-lime-400/80">
                                            {record.plantType || "Plant"}
                                        </span>
                                        <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {record.cureInfo && (
                                        <p className="text-xs text-gray-500 italic truncate">
                                            Includes AI Cure Info
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CropLogbook;
