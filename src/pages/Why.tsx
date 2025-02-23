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

        <div className="flex flex-row gap-12">
          <div className="w-[60%] overflow-hidden">
            <div className="flex flex-col gap-6 w-full">
              <InfiniteMovingCardsDemo />
            </div>
          </div>

          {/* Divider */}
          <div className="w-[2px] bg-gradient-to-b from-transparent via-monad-purple/30 to-transparent" />

          {/* Right section */}
          <div id="tools" className="w-[40%] flex flex-col gap-4 p-3 -mt-24 pt-2 bg-transparent rounded-md">
            <div className="mb-8 text-left">
              <h3 className="text-4xl font-bold text-monad-purple text-center">Supported Tools</h3>
            </div>

            {/* Card 1 */}
            {/* <Card
            //   radius="xl"
              className="h-[160px] overflow-hidden transition-all duration-500 ease-in-out hover:scale-[1.02] border border-monad-purple/30 cursor-default transform-gpu bg-[#f5f5f4] shadow-[0_4px_12px_-2px_rgba(131,110,249,0.12),_0_0_0_1px_rgba(131,110,249,0.08)] hover:shadow-[0_12px_24px_-4px_rgba(131,110,249,0.15),_0_0_0_1px_rgba(131,110,249,0.1)]"
            >
              <Group wrap="nowrap" gap={0}>
                <div className="w-[35%] border-r border-monad-purple/10 rounded-md overflow-hidden">
                  <Image
                    src={standard.src}
                    height={160}
                    width={160}
                    className="object-cover"
                    alt="Article cover"
                  />
                </div>
                <div className="w-[65%] p-6 flex flex-col">
                  <h3 className="text-xl font-bold text-monad-purple mb-3 hover:text-white">
                    Accessibility
                  </h3>
                  <p className="text-sm leading-relaxed text-black/70">
                    Making blockchain interactions simple and intuitive for everyone.
                  </p>
                </div>
              </Group>
            </Card> */}

            {/* Card 2 */}
            {/* <Card
            //   radius="xl"
              className="h-[160px] overflow-hidden transition-all duration-500 ease-in-out hover:scale-[1.02] border border-monad-purple/30 cursor-default transform-gpu bg-[#f5f5f4] shadow-[0_4px_12px_-2px_rgba(131,110,249,0.12),_0_0_0_1px_rgba(131,110,249,0.08)] hover:shadow-[0_12px_24px_-4px_rgba(131,110,249,0.15),_0_0_0_1px_rgba(131,110,249,0.1)]"
            >
              <Group wrap="nowrap" gap={0}>
                <div className="w-[35%] border-r border-monad-purple/10 rounded-md overflow-hidden">
                  <Image
                    src={standard2.src}
                    height={180}
                    width={160}
                    className="object-cover"
                    alt="Article cover"
                  />
                </div>
                <div className="w-[65%] p-6 flex flex-col">
                  <h3 className="text-xl font-bold text-monad-purple mb-3">
                    Innovation
                  </h3>
                  <p className="text-sm leading-relaxed text-black/70">
                    Advanced AI integration for seamless blockchain operations.
                  </p>
                </div>
              </Group>
            </Card> */}

            {/* Card 3 */}
            {/* <Card
            //   radius="xl"
              className="h-[160px] overflow-hidden transition-all duration-500 ease-in-out hover:scale-[1.02] border border-monad-purple/30 cursor-default transform-gpu bg-[#f5f5f4] shadow-[0_4px_12px_-2px_rgba(131,110,249,0.12),_0_0_0_1px_rgba(131,110,249,0.08)] hover:shadow-[0_12px_24px_-4px_rgba(131,110,249,0.15),_0_0_0_1px_rgba(131,110,249,0.1)]"
            >
              <Group wrap="nowrap" gap={0}>
                <div className="w-[35%] border-r border-monad-purple/10 rounded-md overflow-hidden">
                  <Image
                    src={standard3.src}
                    height={180}
                    width={160}
                    className="object-cover"
                    alt="Article cover"
                  />
                </div>
                <div className="w-[65%] p-6 flex flex-col">
                  <h3 className="text-xl font-bold text-monad-purple mb-3">
                    Security
                  </h3>
                  <p className="text-sm leading-relaxed text-black/70">
                    Enterprise-grade security with user-friendly features.
                  </p>
                </div>
              </Group>
            </Card> */}

            <MarqueeDemoVertical/>
          </div>
        </div>
      </div>
    </div>
  );
}
