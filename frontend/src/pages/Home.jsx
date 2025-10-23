import { motion } from "framer-motion";
import { Link, useInRouterContext, BrowserRouter } from "react-router-dom"; // Import necessary hooks/components

// Defines the staggered animation variants for entrance
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, // Stagger elements by 0.2 seconds
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

// Main content component (This is the component you use in your <Route>)
const HomeContent = () => {
    // Note: useInRouterContext will be true if wrapped by a parent router (like in your App.jsx)
    // We only need this here to satisfy the Link/router context requirement, but useInRouterContext
    // checks are usually done in specific contexts, not just for styling purposes.
    return (
        // h-screen guarantees full viewport height, overflow-hidden prevents scrolling
        <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative h-screen flex items-center justify-center bg-gray-950 overflow-hidden"
        >
            {/* Background Watermark Text */}
            <h1 className="absolute z-0 text-transparent font-extrabold select-none pointer-events-none"
                style={{
                    fontSize: 'clamp(8rem, 20vw, 15rem)', // Responsive sizing
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-5deg)', // Subtle rotation
                    WebkitTextStroke: '1px rgba(var(--tw-color-lime-400), 0.1)', // Outline effect
                    textStroke: '1px rgba(var(--tw-color-lime-400), 0.1)',
                    lineHeight: '0.8',
                    color: 'rgba(var(--tw-color-lime-400), 0.03)', // Very faint fill
                    opacity: 0.1,
                }}>
                AGRI VISION
            </h1>

            {/* Main Content Container: Adjusted py for better vertical centering */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between py-20 lg:py-0">
                
                {/* Left: Text Content and CTA */}
                <div className="lg:w-3/5 text-white pr-4 text-center lg:text-left">
                    
                    <motion.p 
                        variants={itemVariants} 
                        className="uppercase tracking-widest text-base text-lime-400 font-medium mb-3 lg:pt-16" // Added pt-16 for space below navbar on large screens
                    >
                        AGRIPREDAI
                    </motion.p>

                    <motion.h1 
                        variants={itemVariants} 
                        className="text-6xl sm:text-7xl xl:text-[6.5rem] font-extrabold leading-tight drop-shadow-xl mb-6"
                    >
                        Precision Crop
                        <br />
                        &amp; <span className="text-lime-500">Detection AI</span>
                    </motion.h1>

                    <motion.p 
                        variants={itemVariants} 
                        className="mt-6 text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
                    >
                        Leverage cutting-edge AI to instantly identify plant health issues, optimize yields, and secure your harvest. Smart farming starts here.
                    </motion.p>

                    <motion.div 
                        variants={itemVariants} 
                        className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    >
                        {/* Start Detection Button */}
                        <Link
                            to="/predict"
                            className="w-full sm:w-auto px-8 py-4 text-xl rounded-lg bg-lime-500 text-gray-900 font-semibold shadow-xl shadow-lime-500/30 transition-all hover:bg-lime-400 hover:scale-[1.03] active:scale-95 transform duration-300 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            Start Detection
                        </Link>
                        
                        {/* Learn More Button */}
                        <Link
                            to="/info"
                            className="w-full sm:w-auto px-8 py-4 text-xl border border-gray-700 text-white font-semibold rounded-lg transition-all hover:bg-gray-800 active:scale-95 transform duration-300 flex items-center justify-center"
                        >
                            Learn More
                        </Link>
                    </motion.div>
                </div>

                {/* Right: AI/Plant Graphic Area */}
                <motion.div 
                    initial={{ opacity: 0, x: 50, scale: 0.9 }} 
                    animate={{ opacity: 1, x: 0, scale: 1 }} 
                    transition={{ delay: 0.8, duration: 1 }}
                    className="lg:w-2/5 mt-16 lg:mt-0 flex items-center justify-center" 
                >
                    <div 
                        className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-gray-900 rounded-[3rem] p-8 border-4 border-lime-500/30 overflow-hidden shadow-2xl transition-transform duration-500 hover:rotate-1 hover:shadow-lime-500/30"
                    >
                        {/* Inner glow effect */}
                        <div className="absolute inset-0 rounded-[3rem] z-0" style={{boxShadow: 'inset 0 0 60px rgba(132,204,22,0.4)'}}></div>
                        
                        {/* AI Plant Icon - Simplified SVG matching the visual style */}
                        <svg className="w-full h-full text-lime-500 relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {/* Base Pot/Stand */}
                            <path d="M30 75 L70 75 M35 75 L35 85 M65 75 L65 85" fill="none"/>
                            <rect x="30" y="70" width="40" height="15" rx="5" fill="#1f2937" stroke="#374151" strokeWidth="3"/>

                            {/* Stem */}
                            <path d="M50 70 V30" stroke="#84CC16" strokeWidth="6"/>

                            {/* Leaves / Sensors */}
                            <path d="M50 40 L25 55 C20 60, 25 70, 30 70 M50 40 L75 55 C80 60, 75 70, 70 70" stroke="#84CC16" strokeWidth="4" fill="rgba(132, 204, 22, 0.1)"/>
                            
                            {/* Scanning Eye/Lens */}
                            <circle cx="50" cy="25" r="10" stroke="#A3E635" strokeWidth="4" fill="#374151"/>
                            <line x1="40" y1="25" x2="60" y2="25" stroke="#A3E635" strokeWidth="2"/>
                            <line x1="50" y1="15" x2="50" y2="35" stroke="#A3E635" strokeWidth="2"/>
                            
                            {/* Scan line effect - Adjusted for vertical movement */}
                            <line 
                                x1="0" y1="50" x2="100" y2="50" 
                                strokeWidth="3" strokeLinecap="round" 
                                className="text-white relative z-20"
                                style={{
                                    animation: 'scanLine-3s 3s infinite ease-in-out',
                                }}
                            />
                        </svg>

                        <div className="absolute bottom-4 right-4 p-2 bg-lime-500 text-gray-900 rounded-full font-bold text-xs shadow-xl animate-bounce-slow z-20">AI Vision</div>
                    </div>
                </motion.div>
            </div>
            
            {/* Custom Styles for required keyframes */}
            <style>{`
                @keyframes scanLine-3s {
                    0% { transform: translateY(20px); opacity: 0.2; }
                    50% { transform: translateY(-35px); opacity: 1; }
                    100% { transform: translateY(20px); opacity: 0.2; }
                }

                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2.5s infinite ease-in-out;
                }
            `}</style>
        </motion.section>
    );
};

// Conditional Wrapper Export
const Home = () => {
    // Determine if we are running inside a Router context
    const inRouterContext = useInRouterContext();
    
    // If not in a router context (i.e., running standalone), wrap it in BrowserRouter
    if (!inRouterContext) {
        return (
            <BrowserRouter>
                <HomeContent />
            </BrowserRouter>
        );
    }
    
    // If already in a router context (i.e., running in your main App.jsx), return the content directly
    return <HomeContent />;
};

export default Home;
