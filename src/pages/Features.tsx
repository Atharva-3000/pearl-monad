import {
    IndentDecrease,
    Swords,
    UserCircle2,
    Wallet2,
    Code2,
} from "lucide-react";

export default function Features() {
    return (
        <div className="min-h-screen bg-pattern w-full flex flex-col items-center justify-center px-4 bg-white !important">
            <div className="mb-8">
                <h3 className="text-center text-5xl font-bold text-monad-purple">Features</h3>
            </div>
            <div className="grid grid-cols-8 gap-6 max-w-7xl w-full p-4 rounded-md grid-flow-dense">
                {/* Box 1 - Updated content and color */}
                <div
                    className="col-span-3 rounded-2xl relative h-72 overflow-hidden 
    transition-all duration-500 ease-in-out hover:scale-[1.02] 
    cursor-default transform-gpu bg-[#f5f5f4]
    shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12),_0_0_0_1px_rgba(0,0,0,0.08)]
    hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.15),_0_0_0_1px_rgba(0,0,0,0.1)]"
                >
                    <div className="relative flex h-full text-black">
                        <div className="w-[30%] flex items-center justify-center border-r border-black/10">
                            <div className="w-16 h-16 bg-black/5 rounded-full justify-center items-center flex">
                                <Swords size={46} className="text-black/80" color="#836EF9"/>
                            </div>
                        </div>
                        <div className="w-[70%] p-4 flex flex-col">
                            <h1 className="text-3xl font-bold border-b border-black/20 mb-12">
                                10+ Tools
                            </h1>
                            <p className="text-xl text-black/70">
                                An Unparalleled Tool Suite for Ultimate Performance and
                                Innovation. Coming OOTB with all the necessary sticks and
                                stones.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Box 2 */}
                <div
                    className="col-span-5 rounded-2xl relative h-72 overflow-hidden 
                    transition-all duration-500 ease-in-out hover:scale-[1.02] 
                    cursor-default transform-gpu bg-[#f5f5f4]
                   shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12),_0_0_0_1px_rgba(0,0,0,0.08)]
    hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.15),_0_0_0_1px_rgba(0,0,0,0.1)]"
                >
                    <div className="relative flex h-full text-black">
                        <div className="w-[30%] flex items-center justify-center border-r border-black/10">
                            <div className="w-16 h-16 bg-black/5 rounded-full justify-center items-center flex">
                                <IndentDecrease size={46} className="text-black/80" color="#836EF9"/>
                            </div>
                        </div>
                        <div className="w-[70%] p-4 flex flex-col">
                            <h1 className="text-3xl font-bold border-b border-black/20 mb-12">
                                P. E. A. R. L. Index
                            </h1>
                            <p className="text-xl text-black/70">
                                Comprehensive Transaction Indexing for Advanced Analysis &
                                Provenance Tracking.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Box 3 */}
                <div
                    className="col-span-2 rounded-2xl relative h-72 overflow-hidden 
                    transition-all duration-500 ease-in-out hover:scale-[1.02] 
                    cursor-default transform-gpu bg-[#f5f5f4]
                    shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12),_0_0_0_1px_rgba(0,0,0,0.08)]
    hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.15),_0_0_0_1px_rgba(0,0,0,0.1)]"
                >
                    <div className="relative flex h-full text-black">
                        <div className="w-[30%] flex items-center justify-center border-r border-black/10">
                            <div className="w-16 h-16 bg-black/5 rounded-full justify-center items-center flex">
                                <UserCircle2 size={46} className="text-black/80" color="#836EF9"/>
                            </div>
                        </div>
                        <div className="w-[70%] p-4 flex flex-col">
                            <h1 className="text-2xl font-bold border-b border-black/20 mb-10">
                                Social Logins
                            </h1>
                            <p className="text-xl text-black/70">
                                Logging in is as simple as login via Google.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Box 4 */}
                <div
                    className="col-span-4 rounded-2xl relative h-72 overflow-hidden 
                    transition-all duration-500 ease-in-out hover:scale-[1.02] 
                    cursor-default transform-gpu bg-[#f5f5f4]
                    shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12),_0_0_0_1px_rgba(0,0,0,0.08)]
    hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.15),_0_0_0_1px_rgba(0,0,0,0.1)]"
                >
                    <div className="relative flex h-full text-black">
                        <div className="w-[30%] flex items-center justify-center border-r border-black/10">
                            <div className="w-16 h-16 bg-black/5 rounded-full justify-center items-center flex">
                                <Wallet2 size={46} className="text-black/80" color="#836EF9"/>
                            </div>
                        </div>
                        <div className="w-[70%] p-4 flex flex-col">
                            <h1 className="text-3xl font-bold border-b border-black/20 mb-12">
                                Embedded Wallets
                            </h1>
                            <p className="text-xl text-black/70">
                                Seamless and Abstracted User Experience with Embedded Wallet
                                Integration.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Box 5 */}
                <div
                    className="col-span-2 rounded-2xl relative h-72 overflow-hidden 
                    transition-all duration-500 ease-in-out hover:scale-[1.02] 
                    cursor-default transform-gpu bg-[#f5f5f4]
                    shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12),_0_0_0_1px_rgba(0,0,0,0.08)]
    hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.15),_0_0_0_1px_rgba(0,0,0,0.1)]"
                >
                    <div className="relative flex h-full text-black">
                        <div className="w-[30%] flex items-center justify-center border-r border-black/10">
                            <div className="w-16 h-16 bg-black/5 rounded-full justify-center items-center flex">
                                <Code2 size={46} className="text-black/80" color="#836EF9"/>
                            </div>
                        </div>
                        <div className="w-[70%] p-4 flex flex-col">
                            <h1 className="text-3xl font-bold border-b border-black/20 mb-12">
                                pearl-SDK
                            </h1>
                            <p className="text-xl text-black/70">
                                Developer friendly SDK for seamless Decentralized Agentic
                                Development.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
