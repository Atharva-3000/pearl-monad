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

            {/* Split screen layout for large screens, stacked for mobile */}
            <div className="block lg:hidden">
                {/* Mobile Layout */}
                <nav className="w-full bg-transparent backdrop-blur-sm pt-8 px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ScanHeart style={{ width: 32, height: 32 }} className="pb-1" />
                            <span className="font-bold tracking-wider text-lg">P. E. A. R. L.</span>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="btn-outline border-black text-sm rounded-full ring-neutral-200 flex items-center gap-2 justify-center bg-gray-100"
                        >
                            <Menu className="w-4 h-4" color='black' />
                            <span className='text-monad-black'>Menu</span>
                        </button>
                    </div>
                </nav>

                {/* Mobile Content */}
                <div className="flex flex-col px-6 pt-16">
                    {/* Title Section */}
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight leading-tight text-monad-purple font-grotesk">
                            Parallel Enhanced<br />
                            <span className='text-monad-berry underline'>
                                <span className='flex flex-row items-center justify-center gap-2'>
                                    AI <Radius size={40} color='black' className='animate-spin-slow' />
                                </span>
                            </span>
                            for Rapid Ledger-processing
                        </h1>
                    </div>

                    {/* Image and Tools Section */}
                    <div className="relative mt-12">
                        <div className="w-full h-[400px] relative rounded-[2rem] overflow-hidden mx-auto max-w-2xl">
                            <Image
                                src={pearl}
                                alt="Decentralized Intelligence"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Overlaid Tools Card */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xl">
                            <div className="glass-card-premium px-6 py-6 rounded-lg bg-clip-padding border border-gray-200"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)'
                                }}>
                                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                                    <div className="flex -space-x-3">
                                        {[AlignVerticalDistributeCenter, Atom, AudioWaveform, Anchor, BringToFrontIcon].map((Icon, i) => (
                                            <div key={i} className="w-8 md:w-10 h-8 md:h-10 rounded-full border-2 border-black bg-neutral-200 flex items-center justify-center">
                                                <Icon className="w-4 md:w-6 h-4 md:h-6 text-black" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col text-center md:text-left">
                                        <span className="font-semibold text-monad-offwhite">10+ Tools</span> {/* Changed from text-monad-berry */}
                                        <span className="text-sm text-black">
                                            Start using it now<br />
                                            Let us take care of it.
                                        </span>
                                    </div>
                                    <button className="btn-glass border border-black bg-monad-black text-white font-medium uppercase flex items-center gap-2 justify-center hover:text-monad-offwhite hover:bg-monad-purple transition-all duration-200 group py-2.5 px-4">
                                        <span>Begin</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout - Original Implementation */}
            <div className="hidden lg:flex">
                {/* Left Half */}
                <div className="w-1/2 min-h-screen relative">
                    {/* Original desktop nav and content */}
                    <nav className="w-full bg-transparent backdrop-blur-sm pt-12 px-12 pb-0 mb-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ScanHeart style={{ width: 32, height: 32 }} className="pb-1" />
                                <span className="font-bold tracking-wider text-lg md:text-xl">P. E. A. R. L.</span>
                            </div>

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="btn-outline border-black text-sm rounded-full ring-neutral-200 flex items-center gap-2 justify-center bg-gray-100"
                            >
                                <Menu className="w-4 h-4" color='black' />
                                <span className='text-monad-black'>Menu</span>
                            </button>
                        </div>
                    </nav>

                    {/* Modified desktop content */}
                    <div className="pt-28 px-12 flex flex-col justify-between h-[95vh]"> {/* Increased from 92vh to 95vh */}
                        <div className="text-left max-w-2xl">
                            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-monad-purple font-grotesk">
                                Parallel Enhanced<br />
                                <span className='text-monad-berry underline'>
                                    <span className='flex flex-row items-center gap-2'>
                                        AI <Radius size={45} color='black' className='animate-spin-slow' />
                                    </span>
                                </span>
                                for Rapid Ledger-processing
                            </h1>
                        </div>

                        {/* Complete Tools Card */}
                        <div className="mt-auto pb-24"> {/* Increased from pb-16 to pb-24 */}
                            <div className="glass-card-premium px-8 py-6 rounded-lg bg-clip-padding border border-gray-200"
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
                                        <span className="font-semibold text-monad-berry ">10+ Tools</span>
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

                {/* Modified Right Half image container */}
                <div className="w-1/2 h-[95vh] relative flex items-center justify-center"> {/* Increased from 92vh to 95vh */}
                    <div className="w-[90%] h-[95%] relative rounded-[2rem] overflow-hidden"> {/* Increased from 90% to 95% */}
                        <Image
                            src={pearl}
                            alt="Decentralized Intelligence"
                            className="w-full h-full object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
