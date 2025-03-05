"use client";

import { useState } from 'react';
import {
    Menu,
    ScanHeart, Radius
} from 'lucide-react';
import pearl from "../../public/pearl_asset_1.jpg";
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ToolsCard } from '@/components/tools-card';

const MenuOverlay = dynamic(() => import('@/components/menu-overlay').then(mod => mod.MenuOverlay), {
    ssr: false,
    loading: () => <div className="menu-loading-placeholder"></div>
});

export default function Hero() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div id="home" className="relative min-h-screen bg-pattern w-full overflow-x-hidden">
            {/* Dropdown Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <MenuOverlay
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                    />
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
                        <h1 className="text-4xl font-bold tracking-tight leading-tight text-monad-purple">
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
                                priority={true} // Add priority to both instances
                                loading="eager"
                                sizes="(max-width: 768px) 100vw, 50vw" // Optimize sizes based on viewport
                            />
                        </div>

                        {/* Overlaid Tools Card */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xl">
                            <ToolsCard isMobile />
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
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
                            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-monad-purple">
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
                            <ToolsCard />
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
