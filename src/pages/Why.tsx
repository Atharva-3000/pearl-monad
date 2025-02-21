'use client';
import { motion } from "framer-motion";

export default function Why() {
    return (
        <div className="min-h-screen bg-pattern w-full py-20">
            <div className="container mx-auto px-4">
                {/* Main Grid Layout - 60/40 split */}
                <div className="flex flex-row gap-8">
                    {/* Left Side - 60% - Scrolling Cards */}
                    <div className="w-[60%] overflow-hidden">
                        <div className="flex flex-col gap-6">
                            {/* Horizontally Scrolling Cards */}
                            <motion.div 
                                className="flex space-x-6 relative"
                                initial={{ x: 0 }}
                                animate={{ x: "-100%" }}
                                transition={{ 
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                {/* Card 1 */}
                                <div className="min-w-[600px] p-6 rounded-xl bg-gradient-to-r from-monad-purple/20 to-transparent backdrop-blur-sm">
                                    <h3 className="text-2xl font-bold mb-4">Introduction to P.E.A.R.L.</h3>
                                    <p className="text-lg">
                                        Parallel Enhanced AI for Rapid-Ledger Processing (P.E.A.R.L.) is an AI-driven platform designed for seamless interaction with blockchain protocols...
                                    </p>
                                </div>
                                
                                {/* Duplicate cards for infinite scroll */}
                                {/* ...similar cards... */}
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Side - 40% - Static Cards */}
                    <div className="w-[40%] flex flex-col gap-6">
                        {/* Static Card 1 */}
                        <div className="h-[300px] rounded-xl bg-gradient-to-r from-monad-berry to-monad-purple p-6">
                            <div className="h-[30%] border-b border-white/20">
                                <h3 className="text-xl font-bold text-white">The Problem</h3>
                            </div>
                            <div className="h-[70%] pt-4">
                                <p className="text-white/80">
                                    Interacting with blockchain protocols can be complex and overwhelming...
                                </p>
                            </div>
                        </div>

                        {/* Static Card 2 */}
                        <div className="h-[300px] rounded-xl bg-gradient-to-r from-monad-purple to-monad-berry p-6">
                            <div className="h-[30%] border-b border-white/20">
                                <h3 className="text-xl font-bold text-white">The Solution</h3>
                            </div>
                            <div className="h-[70%] pt-4">
                                <p className="text-white/80">
                                    P.E.A.R.L. redefines blockchain interaction...
                                </p>
                            </div>
                        </div>

                        {/* Static Card 3 */}
                        <div className="h-[300px] rounded-xl bg-gradient-to-r from-monad-berry to-monad-purple p-6">
                            <div className="h-[30%] border-b border-white/20">
                                <h3 className="text-xl font-bold text-white">The Impact</h3>
                            </div>
                            <div className="h-[70%] pt-4">
                                <p className="text-white/80">
                                    By abstracting intricate blockchain operations...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}