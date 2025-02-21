import { FlickeringGrid } from "./magicui/flickering-grid";
import { SpinningText } from "./magicui/spinning-text";

export default function HeroBottom() {
    return (
        <div className="border-t border-b border-neutral-600 py-12">
            <div className="max-w-7xl mx-4 px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                    {/* Left Section */}
                    <div className="flex flex-row items-center lg:items-center gap-6 justify-center">
                        <FlickeringGrid
                            squareSize={4}
                            gridGap={6}
                            color="#A0055D"
                            maxOpacity={0.5}
                            flickerChance={0.3}
                            height={120}
                            width={200}
                        />
                        <div className="space-y-4 uppercase text-neutral-700 text-xs text-center lg:text-left whitespace-nowrap">
                            <p>TOTALLY AUTOMATED</p>
                            <p>WEB3.0 COMPLIENT</p>
                            <p>EASY ONBOARDING</p>
                            <p>LLM POWERED</p>
                        </div>
                    </div>

                    {/* Center Section */}
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3 justify-center">
                            <span className="tag-pill border-black">Smartcontracts</span>
                            <span className="tag-pill border-black">Blockchain</span>
                        </div>
                        <div className="flex gap-3 justify-center items-center">
                            <span className="tag-pill border-black">AI</span>
                            <span className="tag-pill border-black">WEB3.0</span>
                            <span className="tag-pill bg-monad-berry text-monad-offwhite hover:bg-monad-black hover:text-monad-offwhite">
                                All →
                            </span>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4 w-full relative">
                        <h2 className="text-6xl font-bold tracking-tight">WEB 3.0</h2>
                        {/* Using ml-auto pushes the spinner to the far right */}
                        <div className="space-y-4 uppercase text-neutral-700 text-xs text-center lg:text-left whitespace-nowrap">
                            <p>TOTALLY AUTOMATED</p>
                            <p>WEB3.0 COMPLIENT</p>
                            <p>EASY ONBOARDING</p>
                            <p>LLM POWERED</p>
                        </div>
                        <div className="ml-auto right-10 absolute">
                            <SpinningText className="tracking-normal uppercase" radius={4} fontSize={12}>
                                MONAD REDEFINED
                            </SpinningText>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
