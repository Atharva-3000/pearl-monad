'use client';
import { InfiniteMovingCardsDemo } from "@/components/moving-cards";
import { MarqueeDemoVertical } from "@/components/Marquee";
export default function Why() {
  return (
    <div id="why" className="min-h-screen bg-pattern w-full py-4">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-left pl-4">
          <h3 className="text-4xl font-bold text-monad-purple">Why P.E.A.R.L?</h3>
        </div>

        {/* Changed flex-row to flex-col on smaller screens */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Changed width to full on smaller screens */}
          <div className="w-full lg:w-[60%] overflow-hidden">
            <div className="flex flex-col gap-6 w-full">
              <InfiniteMovingCardsDemo />
            </div>
          </div>

          {/* Hide divider on smaller screens */}
          <div className="hidden lg:block w-[2px] bg-gradient-to-b from-transparent via-monad-purple/30 to-transparent" />

          {/* Right section - Changed width to full on smaller screens */}
          <div id="tools" className="w-full lg:w-[40%] flex flex-col gap-4 p-3 lg:-mt-24 pt-2 bg-transparent rounded-md">
            <div className="mb-8 text-left">
              <h3 className="text-4xl font-bold text-monad-purple text-center">Supported Tools</h3>
            </div>

            {/* Rest of the cards remain unchanged */}
            <MarqueeDemoVertical />
          </div>
        </div>
      </div>
    </div>
  );
}
