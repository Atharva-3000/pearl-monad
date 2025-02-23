"use client";

import { useState } from 'react';
import {
    Menu, ChevronRight, AudioWaveform, Anchor,
    AlignVerticalDistributeCenter, Atom, BringToFrontIcon,
    ScanHeart, Radius, X
} from 'lucide-react';
import pearl from "../../public/pearl_asset_1.jpg";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Variants for the overlay sliding animation
    const overlayVariants = {
        hidden: { y: "-100%" },
        visible: { y: "0%" },
        exit: { y: "-100%" }
    };

    return (
        <div id="home" className="relative min-h-screen bg-pattern w-full overflow-x-hidden">
            {/* Dropdown Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={overlayVariants}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed top-0 left-0 w-full h-full z-50"
                    >
                        <div className="absolute inset-0 bg-monad-berry backdrop-blur-xl">
                            {/* Close Button with Rotation Animation */}
                            <motion.button
                                onClick={() => setIsMenuOpen(false)}
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                exit={{ rotate: -360 }}
                                transition={{ duration: 0.5, ease: "linear" }}
                                className="absolute top-8 right-8 p-2"
                            >
                                <X className="w-8 h-8 text-monad-offwhite" />
                            </motion.button>

                            <div className="flex flex-col items-center justify-center h-full gap-8">
                                {['Home', 'Features', 'Why', 'Tools', 'Footer'].map((link) => (
                                    <a
                                        key={link}
                                        href={`#${link.toLowerCase()}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsMenuOpen(false);
                                            const element = document.getElementById(link.toLowerCase());
                                            element?.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start'
                                            });
                                        }}
                                        className="relative text-4xl font-bold text-monad-offwhite transition-transform duration-300 transform hover:scale-110 group"
                                    >
                                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        <span className="relative group-hover:text-black">{link}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex">
                {/* Left Half */}
                <div className="w-1/2 min-h-screen relative">
                    <nav className="w-full bg-transparent backdrop-blur-sm pt-12 px-12 pb-0 mb-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ScanHeart style={{ width: 36, height: 36 }} className="pb-1" />
                                <span className="font-bold tracking-wider text-xl">P. E. A. R. L.</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="btn-outline border-black text-sm rounded-full ring-neutral-200 flex items-center gap-2 justify-center bg-gray-100"
                                >
                                    <Menu className="w-4 h-4" color='black' />
                                    <span className='text-monad-black'>Menu</span>
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* Content */}
                    <div className="pt-28 px-12">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-monad-purple font-grotesk">
                                    Parallel Enhanced<br />
                                    <span className='text-monad-berry underline'>
                                        <span className='flex flex-row items-center gap-2'>
                                            AI <span>
                                                <Radius size={45} color='black' className='animate-spin-slow' />
                                            </span>
                                        </span>
                                    </span>
                                    for Rapid Ledger-processing
                                </h1>

                                <div className='pt-16'>
                                    <div
                                        className="glass-card-premium relative px-8 py-6 shadow-lg rounded-lg bg-clip-padding bg-opacity-40 border border-gray-200"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(20px)',
                                            WebkitBackdropFilter: 'blur(20px)'
                                        }}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="flex -space-x-3">
                                                {[AlignVerticalDistributeCenter, Atom, AudioWaveform, Anchor, BringToFrontIcon].map((Icon, i) => (
                                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-neutral-200 flex items-center justify-center">
                                                        <Icon className="w-6 h-6 text-black" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-monad-berry">10+ Tools</span>
                                                <span className="text-sm text-black">
                                                    Start using it now<br />
                                                    Let us take care of it.
                                                </span>
                                            </div>
                                            <button className="btn-glass ml-4 border border-black bg-monad-black text-white font-medium uppercase flex items-center gap-2 justify-center flex-row hover:text-monad-offwhite hover:bg-monad-purple transition-all duration-200 group py-2.5">
                                                <span>Begin</span>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Half */}
                <div className="w-1/2 min-h-screen relative flex items-center justify-center">
                    <div className="w-[90%] h-[88%] relative rounded-[2rem] overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-black opacity-15"></div>
                            <Image
                                src={pearl}
                                alt="Decentralized Intelligence"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
