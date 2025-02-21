import { Menu, ChevronRight, AudioWaveform, Anchor, AlignVerticalDistributeCenter, Atom, BringToFrontIcon, ScanHeart, Radius } from 'lucide-react';
import pearl from "../../public/pearl_asset_1.jpg";
import Image from 'next/image';

export default function Hero() {
    return (
        <div className="relative min-h-screen bg-pattern w-full overflow-x-hidden">
            {/* Main Container */}
            <div className="flex">
                {/* Left Half */}
                <div className="w-1/2 min-h-screen relative">
                    {/* Navigation */}
                    <nav className="w-full bg-transparent backdrop-blur-sm pt-12 px-12 pb-0 mb-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ScanHeart style={{ width: 36, height: 36 }} className="pb-1" />
                                <span className="font-bold tracking-wider text-xl">P. E. A. R. L.</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className="cursor-pointer text-sm">Contact us</span>
                                <button className="btn-outline border-black text-sm rounded-full ring-neutral-200 flex items-center gap-2 justify-center bg-gray-100">
                                    <Menu className="w-4 h-4" />
                                    <span>Menu</span>
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
                                        <span className='flex flex-row  items-center gap-2'>
                                            AI <span><Radius size={45} color='black' className='animate-spin-slow' /></span>
                                        </span>
                                    </span>
                                    for Rapid Ledger-processing
                                </h1>

                                <div className='pt-16'>
                                    <div className="glass-card-premium relative px-8 py-6 shadow-lg rounded-lg bg-clip-padding bg-opacity-40 border border-gray-200"
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
                                                <span className="text-sm text-black">Start using it now<br />Let us take care of it.</span>
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
                    <div className="w-[90%] h-[88%] relative rounded-[2rem] overflow-hidden"> {/* Changed from h-[70%] to h-[85%] - less height reduction */}
                        <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-black opacity-15"></div> {/* Dark overlay */}
                            <Image
                                src={pearl}
                                alt="Decentralized Intelligence"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* User Avatar */}
                        {/* <div className="absolute top-3 right-3 rounded-full bg-white p-1">
                            <Image
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                                alt="User Avatar"
                                width={30}
                                height={30}
                                className="rounded-full"
                            />
                        </div> */}
                    </div>

                    {/* User Stats Card */}
                </div>
            </div>

            {/* Bottom Section */}

        </div>
    );
}